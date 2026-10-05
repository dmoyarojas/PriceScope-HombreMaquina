/* ================================================================
   PriceScope — routes/auth.js
   Registro con verificación por correo (código 4 dígitos)
   Login y verificación de token JWT
   DB: Supabase JS client

   Seguridad implementada:
   - Login: máx 5 intentos fallidos → bloqueo 5 minutos
   - OTP registro: máx 5 intentos + 3 reenvíos
   - OTP recuperación: máx 5 intentos + 3 reenvíos
   - Contraseña segura: mín 8 chars, 1 may, 1 min, 1 especial
================================================================ */
const router     = require('express').Router();
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const supabase   = require('../db');

/* ─────────────────────────────────────────────────────────────
   TRANSPORTER DE GMAIL
───────────────────────────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/* ─────────────────────────────────────────────────────────────
   ALMACÉN TEMPORAL de códigos de verificación (en memoria)
───────────────────────────────────────────────────────────── */
const pendientes = new Map();

/* ─────────────────────────────────────────────────────────────
   RATE LIMITING — Login
   Estructura: { intentos, bloqueadoHasta }
───────────────────────────────────────────────────────────── */
const loginIntentos = new Map();

const MAX_LOGIN_INTENTOS  = 5;
const LOGIN_BLOQUEO_MS    = 5 * 60 * 1000; // 5 minutos

function chequearBloqueoLogin(correo) {
  const reg = loginIntentos.get(correo);
  if (!reg) return null;
  if (reg.bloqueadoHasta && Date.now() < reg.bloqueadoHasta) {
    const restanMs = reg.bloqueadoHasta - Date.now();
    const restanMin = Math.ceil(restanMs / 60000);
    return { bloqueado: true, restanMs, restanMin };
  }
  return null;
}

function registrarIntentoFallidoLogin(correo) {
  const reg = loginIntentos.get(correo) || { intentos: 0, bloqueadoHasta: null };
  reg.intentos += 1;
  if (reg.intentos >= MAX_LOGIN_INTENTOS) {
    reg.bloqueadoHasta = Date.now() + LOGIN_BLOQUEO_MS;
    reg.intentos = 0; // reiniciar para siguiente ciclo
  }
  loginIntentos.set(correo, reg);
}

function limpiarIntentoLogin(correo) {
  loginIntentos.delete(correo);
}

/* ─────────────────────────────────────────────────────────────
   RATE LIMITING — OTP (registro y recuperación)
   Estructura en pendientes: agrega intentosOTP, bloqueadoHasta, reenvios
───────────────────────────────────────────────────────────── */
const MAX_OTP_INTENTOS   = 5;
const MAX_OTP_REENVIOS   = 3;
const OTP_BLOQUEO_MS     = 5 * 60 * 1000; // 5 minutos

/* ── Middleware verificar token JWT ── */
const verificarToken = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ ok: false, error: 'Token requerido' });
  const token = auth.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: 'Token inválido' });
  }
};

/* ─────────────────────────────────────────────────────────────
   VALIDACIÓN DE CONTRASEÑA SEGURA
───────────────────────────────────────────────────────────── */
function validarContrasenaSegura(contrasena) {
  const errores = [];
  if (contrasena.length < 8)
    errores.push('al menos 8 caracteres');
  if (!/[A-Z]/.test(contrasena))
    errores.push('al menos 1 letra mayúscula');
  if (!/[a-z]/.test(contrasena))
    errores.push('al menos 1 letra minúscula');
  if (!/[^A-Za-z0-9]/.test(contrasena))
    errores.push('al menos 1 carácter especial (!@#$%...)');
  return errores;
}

/* ─────────────────────────────────────────────────────────────
   HELPER: generar y enviar código OTP
───────────────────────────────────────────────────────────── */
function generarCodigo() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function enviarCodigo({ correo, nombre, asunto, tipo }) {
  const codigo = generarCodigo();
  await transporter.sendMail({
    from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
    to:      correo,
    subject: asunto,
    html: `
      <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e40af;margin-bottom:8px">PriceScope</h2>
        <p style="color:#374151">Hola <strong>${nombre}</strong>, ingresá este código ${tipo === 'recuperacion' ? 'para restablecer tu contraseña' : 'para confirmar tu cuenta'}:</p>
        <div style="background:#f0f6ff;border-radius:10px;padding:20px;text-align:center;margin:24px 0">
          <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1e40af">${codigo}</span>
        </div>
        <p style="color:#6b7280;font-size:13px">Este código expira en <strong>10 minutos</strong>.</p>
        <p style="color:#6b7280;font-size:13px">Si no solicitaste esto, ignorá este mensaje.</p>
      </div>
    `
  });
  return codigo;
}

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/registro
   Paso 1: valida datos, guarda pendiente, envía código al correo
───────────────────────────────────────────────────────────── */
router.post('/registro', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena)
    return res.status(400).json({ ok: false, error: 'Todos los campos son obligatorios' });

  // Validar contraseña segura
  const erroresPass = validarContrasenaSegura(contrasena);
  if (erroresPass.length > 0)
    return res.status(400).json({
      ok: false,
      error: `La contraseña necesita: ${erroresPass.join(', ')}.`
    });

  try {
    /* Verificar que el correo no esté registrado */
    const { data: existe } = await supabase
      .from('usuarios')
      .select('id')
      .eq('correo', correo)
      .maybeSingle();

    if (existe)
      return res.status(400).json({ ok: false, error: 'El correo ya está registrado' });

    const codigo = await enviarCodigo({
      correo,
      nombre,
      asunto: 'Tu código de verificación — PriceScope',
      tipo: 'registro'
    });

    /* Hash de la contraseña */
    const hashContrasena = await bcrypt.hash(contrasena, 10);

    /* Guardar en pendientes con expiración de 10 minutos */
    pendientes.set(correo, {
      codigo,
      nombre,
      hashContrasena,
      expira:         Date.now() + 10 * 60 * 1000,
      intentosOTP:    0,
      bloqueadoHasta: null,
      reenvios:       0,
      ultimoReenvio:  Date.now()
    });

    console.log(`✉️  Código ${codigo} enviado a ${correo}`);
    res.json({ ok: true, pendiente: true, mensaje: `Código enviado a ${correo}` });

  } catch (e) {
    console.error('Error en /registro:', e);
    if (e.code === 'EAUTH' || e.responseCode === 535) {
      return res.status(500).json({ ok: false, error: 'Error al enviar el correo. Verificá las credenciales de Gmail en .env' });
    }
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/registro/reenviar
   Reenviar código OTP de registro
───────────────────────────────────────────────────────────── */
router.post('/registro/reenviar', async (req, res) => {
  const { correo } = req.body;
  if (!correo)
    return res.status(400).json({ ok: false, error: 'Correo requerido' });

  const pendiente = pendientes.get(correo);
  if (!pendiente)
    return res.status(400).json({ ok: false, error: 'No hay un registro pendiente para ese correo' });

  // Verificar límite de reenvíos
  if (pendiente.reenvios >= MAX_OTP_REENVIOS)
    return res.status(429).json({
      ok: false,
      error: `Alcanzaste el límite de ${MAX_OTP_REENVIOS} reenvíos. Por favor registrate de nuevo.`
    });

  // Cooldown de 60 segundos entre reenvíos
  const ahora = Date.now();
  const tiempoPasado = ahora - (pendiente.ultimoReenvio || 0);
  if (tiempoPasado < 60000) {
    const restanSeg = Math.ceil((60000 - tiempoPasado) / 1000);
    return res.status(429).json({
      ok: false,
      error: `Espera ${restanSeg} segundos antes de reenviar.`,
      restanSeg
    });
  }

  try {
    const nuevoCodigo = await enviarCodigo({
      correo,
      nombre:   pendiente.nombre,
      asunto:   'Nuevo código de verificación — PriceScope',
      tipo:     'registro'
    });

    pendiente.codigo        = nuevoCodigo;
    pendiente.expira        = Date.now() + 10 * 60 * 1000;
    pendiente.intentosOTP   = 0;
    pendiente.bloqueadoHasta = null;
    pendiente.reenvios      += 1;
    pendiente.ultimoReenvio = Date.now();
    pendientes.set(correo, pendiente);

    console.log(`✉️  Código reenviado ${nuevoCodigo} a ${correo} (reenvío ${pendiente.reenvios}/${MAX_OTP_REENVIOS})`);
    res.json({
      ok: true,
      mensaje: 'Código reenviado',
      reenviosRestantes: MAX_OTP_REENVIOS - pendiente.reenvios
    });
  } catch (e) {
    console.error('Error en /registro/reenviar:', e);
    res.status(500).json({ ok: false, error: 'Error al enviar el correo' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/verificar
   Paso 2: recibe { correo, codigo } → si coincide, crea la cuenta
───────────────────────────────────────────────────────────── */
router.post('/verificar', async (req, res) => {
  const { correo, codigo } = req.body;

  if (!correo || !codigo)
    return res.status(400).json({ ok: false, error: 'Correo y código son obligatorios' });

  const pendiente = pendientes.get(correo);

  if (!pendiente)
    return res.status(400).json({ ok: false, error: 'No hay un registro pendiente para ese correo' });

  // Verificar bloqueo OTP
  if (pendiente.bloqueadoHasta && Date.now() < pendiente.bloqueadoHasta) {
    const restanMs  = pendiente.bloqueadoHasta - Date.now();
    const restanMin = Math.ceil(restanMs / 60000);
    return res.status(429).json({
      ok: false,
      error: `Demasiados intentos incorrectos. Intenta de nuevo en ${restanMin} minuto${restanMin > 1 ? 's' : ''}.`,
      bloqueado: true,
      restanMs
    });
  }

  if (Date.now() > pendiente.expira) {
    pendientes.delete(correo);
    return res.status(400).json({ ok: false, error: 'El código expiró. Volvé a registrarte.' });
  }

  if (pendiente.codigo !== String(codigo).trim()) {
    pendiente.intentosOTP = (pendiente.intentosOTP || 0) + 1;
    const restantes = MAX_OTP_INTENTOS - pendiente.intentosOTP;

    if (pendiente.intentosOTP >= MAX_OTP_INTENTOS) {
      pendiente.bloqueadoHasta = Date.now() + OTP_BLOQUEO_MS;
      pendientes.set(correo, pendiente);
      return res.status(429).json({
        ok: false,
        error: 'Demasiados intentos incorrectos. Intenta de nuevo en 5 minutos.',
        bloqueado: true,
        restanMs: OTP_BLOQUEO_MS
      });
    }

    pendientes.set(correo, pendiente);
    return res.status(400).json({
      ok: false,
      error: `Código incorrecto. Te quedan ${restantes} intento${restantes !== 1 ? 's' : ''}.`,
      intentosRestantes: restantes
    });
  }

  /* Código correcto → insertar usuario en Supabase */
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({ nombre: pendiente.nombre, correo, contrasena: pendiente.hashContrasena })
      .select('id')
      .single();

    if (error) throw error;

    pendientes.delete(correo);

    const token = jwt.sign(
      { id: data.id, nombre: pendiente.nombre, correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      token,
      usuario: { id: data.id, nombre: pendiente.nombre, correo }
    });

  } catch (e) {
    console.error('Error en /verificar:', e);
    res.status(500).json({ ok: false, error: 'Error guardando el usuario en la base de datos' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/login
───────────────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ ok: false, error: 'Correo y contraseña requeridos' });

  // Chequear bloqueo por intentos fallidos
  const bloqueo = chequearBloqueoLogin(correo);
  if (bloqueo) {
    return res.status(429).json({
      ok: false,
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${bloqueo.restanMin} minuto${bloqueo.restanMin > 1 ? 's' : ''}.`,
      bloqueado: true,
      restanMs:  bloqueo.restanMs
    });
  }

  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .maybeSingle();

    if (error) throw error;

    if (!usuario) {
      registrarIntentoFallidoLogin(correo);
      const regActual = loginIntentos.get(correo);
      const intentosHechos = regActual ? (regActual.bloqueadoHasta ? MAX_LOGIN_INTENTOS : regActual.intentos) : 1;
      const restantes = Math.max(0, MAX_LOGIN_INTENTOS - intentosHechos);
      return res.status(401).json({
        ok: false,
        error: `Correo o contraseña incorrectos. Te quedan ${restantes} intento${restantes !== 1 ? 's' : ''}.`,
        intentosRestantes: restantes
      });
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      registrarIntentoFallidoLogin(correo);
      const regActual = loginIntentos.get(correo);
      const bloqueadoAhora = regActual?.bloqueadoHasta && Date.now() < regActual.bloqueadoHasta;

      if (bloqueadoAhora) {
        const restanMs  = regActual.bloqueadoHasta - Date.now();
        const restanMin = Math.ceil(restanMs / 60000);
        return res.status(429).json({
          ok: false,
          error: `Demasiados intentos fallidos. Intenta de nuevo en ${restanMin} minuto${restanMin > 1 ? 's' : ''}.`,
          bloqueado: true,
          restanMs
        });
      }

      const intentosHechos = regActual ? regActual.intentos : 1;
      const restantes = Math.max(0, MAX_LOGIN_INTENTOS - intentosHechos);
      return res.status(401).json({
        ok: false,
        error: `Correo o contraseña incorrectos. Te quedan ${restantes} intento${restantes !== 1 ? 's' : ''}.`,
        intentosRestantes: restantes
      });
    }

    // Login exitoso → limpiar intentos
    limpiarIntentoLogin(correo);

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ ok: true, token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } });

  } catch (e) {
    console.error('Error en /login:', e);
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

/* ─────────────────────────────────────────────────────────────
   GET /api/auth/perfil
───────────────────────────────────────────────────────────── */
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, fecha_registro')
      .eq('id', req.usuario.id)
      .maybeSingle();

    if (error) throw error;
    if (!usuario) return res.status(404).json({ ok: false, error: 'Usuario no encontrado' });

    res.json({ ok: true, usuario });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/recuperar
   Paso 1: recibe { correo } → genera código y lo envía
───────────────────────────────────────────────────────────── */
router.post('/recuperar', async (req, res) => {
  const { correo } = req.body;

  if (!correo)
    return res.status(400).json({ ok: false, error: 'El correo es obligatorio' });

  try {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id, nombre')
      .eq('correo', correo)
      .maybeSingle();

    /* Si el correo no existe, responder igual para no revelar info */
    if (!usuario) return res.json({ ok: true });

    const clave = `rec_${correo}`;
    const existente = pendientes.get(clave);

    // Cooldown de 60 segundos entre solicitudes
    if (existente && existente.ultimoReenvio) {
      const tiempoPasado = Date.now() - existente.ultimoReenvio;
      if (tiempoPasado < 60000) {
        const restanSeg = Math.ceil((60000 - tiempoPasado) / 1000);
        return res.status(429).json({
          ok: false,
          error: `Espera ${restanSeg} segundos antes de solicitar otro código.`,
          restanSeg
        });
      }
    }

    const codigo = await enviarCodigo({
      correo,
      nombre:  usuario.nombre,
      asunto:  'Recupera tu contraseña — PriceScope',
      tipo:    'recuperacion'
    });

    const reenviosActuales = existente ? (existente.reenvios || 0) + 1 : 0;
    if (reenviosActuales > MAX_OTP_REENVIOS) {
      return res.status(429).json({
        ok: false,
        error: `Alcanzaste el límite de reenvíos. Intenta más tarde.`
      });
    }

    pendientes.set(clave, {
      codigo,
      expira:         Date.now() + 10 * 60 * 1000,
      intentosOTP:    0,
      bloqueadoHasta: null,
      reenvios:       reenviosActuales,
      ultimoReenvio:  Date.now()
    });

    console.log(`🔑 Código recuperación ${codigo} enviado a ${correo}`);
    res.json({
      ok: true,
      reenviosRestantes: MAX_OTP_REENVIOS - reenviosActuales
    });

  } catch (e) {
    console.error('Error en /recuperar:', e);
    res.status(500).json({ ok: false, error: 'Error en el servidor' });
  }
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/recuperar/verificar
   Paso 2: recibe { correo, codigo, nuevaContrasena } → actualiza
───────────────────────────────────────────────────────────── */
router.post('/recuperar/verificar', async (req, res) => {
  const { correo, codigo, nuevaContrasena } = req.body;

  if (!correo || !codigo || !nuevaContrasena)
    return res.status(400).json({ ok: false, error: 'Todos los campos son obligatorios' });

  // Validar contraseña segura
  const erroresPass = validarContrasenaSegura(nuevaContrasena);
  if (erroresPass.length > 0)
    return res.status(400).json({
      ok: false,
      error: `La contraseña necesita: ${erroresPass.join(', ')}.`
    });

  const clave = `rec_${correo}`;
  const pendiente = pendientes.get(clave);

  if (!pendiente)
    return res.status(400).json({ ok: false, error: 'No hay una solicitud pendiente para ese correo' });

  // Verificar bloqueo OTP
  if (pendiente.bloqueadoHasta && Date.now() < pendiente.bloqueadoHasta) {
    const restanMs  = pendiente.bloqueadoHasta - Date.now();
    const restanMin = Math.ceil(restanMs / 60000);
    return res.status(429).json({
      ok: false,
      error: `Demasiados intentos incorrectos. Intenta de nuevo en ${restanMin} minuto${restanMin > 1 ? 's' : ''}.`,
      bloqueado: true,
      restanMs
    });
  }

  if (Date.now() > pendiente.expira) {
    pendientes.delete(clave);
    return res.status(400).json({ ok: false, error: 'El código expiró. Solicitá uno nuevo.' });
  }

  if (pendiente.codigo !== String(codigo).trim()) {
    pendiente.intentosOTP = (pendiente.intentosOTP || 0) + 1;
    const restantes = MAX_OTP_INTENTOS - pendiente.intentosOTP;

    if (pendiente.intentosOTP >= MAX_OTP_INTENTOS) {
      pendiente.bloqueadoHasta = Date.now() + OTP_BLOQUEO_MS;
      pendientes.set(clave, pendiente);
      return res.status(429).json({
        ok: false,
        error: 'Demasiados intentos incorrectos. Intenta de nuevo en 5 minutos.',
        bloqueado: true,
        restanMs: OTP_BLOQUEO_MS
      });
    }

    pendientes.set(clave, pendiente);
    return res.status(400).json({
      ok: false,
      error: `Código incorrecto. Te quedan ${restantes} intento${restantes !== 1 ? 's' : ''}.`,
      intentosRestantes: restantes
    });
  }

  try {
    const hash = await bcrypt.hash(nuevaContrasena, 10);

    const { error } = await supabase
      .from('usuarios')
      .update({ contrasena: hash })
      .eq('correo', correo);

    if (error) throw error;

    pendientes.delete(clave);
    // Limpiar también intentos de login si los había
    limpiarIntentoLogin(correo);

    console.log(`✅ Contraseña actualizada para ${correo}`);
    res.json({ ok: true, mensaje: 'Contraseña actualizada correctamente' });

  } catch (e) {
    console.error('Error en /recuperar/verificar:', e);
    res.status(500).json({ ok: false, error: 'Error actualizando la contraseña' });
  }
});

module.exports = router;
module.exports.verificarToken = verificarToken;
