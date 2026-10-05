/* ================================================================
   PriceScope — routes/alertas.js
   CRUD de alertas + email de confirmación + notificaciones web
   DB: Supabase JS client
================================================================ */
const router     = require('express').Router();
const supabase   = require('../db');
const nodemailer = require('nodemailer');
const { verificarToken } = require('./auth');

/* ── Transporter Gmail ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/* ─────────────────────────────────────────────────────────────
   Helpers de email
───────────────────────────────────────────────────────────── */
async function enviarEmailConfirmacion({ correo, nombre, producto, precioObjetivo, precioMin, precioMax }) {
  const esRango = precioMin && precioMax;
  const precioTexto = esRango
    ? `entre <strong>S/ ${parseFloat(precioMin).toLocaleString('es-PE')}</strong> y <strong>S/ ${parseFloat(precioMax).toLocaleString('es-PE')}</strong>`
    : `<strong>S/ ${parseFloat(precioObjetivo).toLocaleString('es-PE')}</strong>`;

  await transporter.sendMail({
    from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
    to:      correo,
    subject: `🔔 Alerta creada: ${producto}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e40af;margin-bottom:4px">PriceScope</h2>
        <p style="color:#6b7280;font-size:13px;margin-top:0">Comparador de precios inteligente</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <p style="color:#374151">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#374151">
          Tu alerta fue creada exitosamente. Te avisaremos cuando 
          <strong>${producto}</strong> llegue al precio ${precioTexto}.
        </p>
        <div style="background:#f0f9ff;border-left:4px solid #1e40af;border-radius:6px;padding:16px 20px;margin:24px 0">
          <p style="margin:0 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.5px">Producto</p>
          <p style="margin:0 0 12px;color:#111827;font-weight:600">${producto}</p>
          <p style="margin:0 0 6px;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.5px">Precio objetivo</p>
          <p style="margin:0;color:#1e40af;font-size:20px;font-weight:800">${precioTexto.replace(/<\/?strong>/g, '')}</p>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/mis-alertas.html"
           style="display:inline-block;background:#1e40af;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          Ver mis alertas →
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">
          Si no creaste esta alerta, puedes ignorar este mensaje.
        </p>
      </div>
    `
  });
}

async function enviarEmailEdicion({ correo, nombre, producto, precioMin, precioMax }) {
  const precioTexto = `entre <strong>S/ ${parseFloat(precioMin).toLocaleString('es-PE')}</strong> y <strong>S/ ${parseFloat(precioMax).toLocaleString('es-PE')}</strong>`;

  await transporter.sendMail({
    from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
    to:      correo,
    subject: `✏️ Alerta actualizada: ${producto}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e40af;margin-bottom:4px">PriceScope</h2>
        <p style="color:#6b7280;font-size:13px;margin-top:0">Comparador de precios inteligente</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <p style="color:#374151">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#374151">
          Has actualizado tu alerta para <strong>${producto}</strong>.
          Te avisaremos cuando llegue al nuevo rango: ${precioTexto}.
        </p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/mis-alertas.html"
           style="display:inline-block;background:#1e40af;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;margin-top:16px;">
          Ver mis alertas →
        </a>
      </div>
    `
  });
}

async function enviarEmailDisparo({ correo, nombre, producto, precioActual, precioObjetivo, precioMin, precioMax, detalleId }) {
  const esRango = precioMin && precioMax;
  const objetivoTexto = esRango
    ? `S/ ${parseFloat(precioMin).toLocaleString('es-PE')} – S/ ${parseFloat(precioMax).toLocaleString('es-PE')}`
    : `S/ ${parseFloat(precioObjetivo).toLocaleString('es-PE')}`;
  const verUrl = detalleId
    ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}/detalle-producto.html?id=${detalleId}`
    : `${process.env.FRONTEND_URL || 'http://localhost:3000'}/mis-alertas.html`;

  await transporter.sendMail({
    from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
    to:      correo,
    subject: `🎯 ¡Precio alcanzado! ${producto}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e40af;margin-bottom:4px">PriceScope</h2>
        <p style="color:#6b7280;font-size:13px;margin-top:0">Comparador de precios inteligente</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:6px;padding:16px 20px;margin-bottom:24px">
          <p style="margin:0;color:#15803d;font-weight:700;font-size:16px">🎯 ¡Tu precio objetivo fue alcanzado!</p>
        </div>
        <p style="color:#374151">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#374151">
          El precio de <strong>${producto}</strong> ha bajado a tu objetivo.
        </p>
        <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:20px 0">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="color:#6b7280;font-size:13px;padding:6px 0">Producto</td>
              <td style="color:#111827;font-weight:600;text-align:right;padding:6px 0">${producto}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:13px;padding:6px 0">Precio actual</td>
              <td style="color:#16a34a;font-weight:800;font-size:18px;text-align:right;padding:6px 0">S/ ${parseFloat(precioActual).toLocaleString('es-PE')}</td>
            </tr>
            <tr>
              <td style="color:#6b7280;font-size:13px;padding:6px 0">Tu objetivo era</td>
              <td style="color:#374151;text-align:right;padding:6px 0">${objetivoTexto}</td>
            </tr>
          </table>
        </div>
        <a href="${verUrl}"
           style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          Ver producto →
        </a>
        <p style="color:#9ca3af;font-size:12px;margin-top:24px">
          Esta alerta fue marcada como cumplida y ya no se repetirá.
        </p>
      </div>
    `
  });
}

async function enviarEmailExpiracion({ correo, nombre, producto, diasRestantes }) {
  const verUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/mis-alertas.html`;
  await transporter.sendMail({
    from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
    to:      correo,
    subject: `⏰ Tu alerta expira en ${diasRestantes} día${diasRestantes > 1 ? 's' : ''}: ${producto}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e40af;margin-bottom:4px">PriceScope</h2>
        <p style="color:#6b7280;font-size:13px;margin-top:0">Comparador de precios inteligente</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <div style="background:#fff8ed;border-left:4px solid #d97706;border-radius:6px;padding:16px 20px;margin-bottom:20px">
          <p style="margin:0;color:#92400e;font-weight:700">⏰ Tu alerta expira en ${diasRestantes} día${diasRestantes > 1 ? 's' : ''}</p>
        </div>
        <p style="color:#374151">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#374151">
          Tu alerta para <strong>${producto}</strong> está próxima a vencer.
          Si aún no ha bajado al precio que buscas, puedes reactivarla.
        </p>
        <a href="${verUrl}" style="display:inline-block;background:#d97706;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Reactivar mi alerta →</a>
      </div>
    `
  });
}

async function enviarEmailExpirada({ correo, nombre, producto }) {
  const verUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/mis-alertas.html`;
  await transporter.sendMail({
    from:    `"PriceScope" <${process.env.GMAIL_USER}>`,
    to:      correo,
    subject: `❌ Alerta expirada (21 días): ${producto}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e40af;margin-bottom:4px">PriceScope</h2>
        <p style="color:#6b7280;font-size:13px;margin-top:0">Comparador de precios inteligente</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
        <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:6px;padding:16px 20px;margin-bottom:20px">
          <p style="margin:0;color:#991b1b;font-weight:700">❌ Tu alerta ha expirado</p>
        </div>
        <p style="color:#374151">Hola <strong>${nombre}</strong>,</p>
        <p style="color:#374151">
          Tu alerta para <strong>${producto}</strong> cumplió sus 21 días.
          Puedes reactivarla fácilmente desde Mis Alertas.
        </p>
        <a href="${verUrl}" style="display:inline-block;background:#1e40af;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">Reactivar o eliminar →</a>
      </div>
    `
  });
}


/* ─────────────────────────────────────────────────────────────
   POST /api/alertas — crear alerta + email de confirmación
───────────────────────────────────────────────────────────── */
router.post('/', verificarToken, async (req, res) => {
  const {
    producto_nombre, producto_marca, producto_modelo,
    pulgadas, precio_objetivo, precio_min, precio_max,
    fuentes, detalle_id
  } = req.body;

  if (!producto_nombre || !precio_objetivo)
    return res.status(400).json({ error: 'Nombre del producto y precio objetivo son obligatorios' });

  try {
    const { data, error } = await supabase
      .from('alertas')
      .insert({
        usuario_id:      req.usuario.id,
        producto_nombre,
        producto_marca:  producto_marca  || '',
        producto_modelo: producto_modelo || '',
        pulgadas:        pulgadas        || '',
        precio_objetivo,
        precio_min:      precio_min  || null,
        precio_max:      precio_max  || null,
        fuentes:         fuentes     || 'MercadoLibre,eBay,Amazon',
        detalle_id:      detalle_id  || null
      })
      .select('id')
      .single();

    if (error) throw error;

    /* Email de confirmación — en segundo plano */
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('nombre, correo')
      .eq('id', req.usuario.id)
      .maybeSingle();

    if (usuario) {
      enviarEmailConfirmacion({
        correo:        usuario.correo,
        nombre:        usuario.nombre,
        producto:      producto_nombre,
        precioObjetivo: precio_objetivo,
        precioMin:     precio_min || null,
        precioMax:     precio_max || null
      }).catch(e => console.error('Error enviando email confirmación alerta:', e.message));
    }

    res.json({ ok: true, id: data.id, mensaje: 'Alerta creada correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error creando alerta' });
  }
});


/* ─────────────────────────────────────────────────────────────
   GET /api/alertas — listar alertas del usuario
───────────────────────────────────────────────────────────── */
router.get('/', verificarToken, async (req, res) => {
  try {
    /* Obtener todas las alertas del usuario (activas, disparadas y expiradas) */
    const { data: alertas, error } = await supabase
      .from('alertas')
      .select('*')
      .eq('usuario_id', req.usuario.id)
      .order('disparada',      { ascending: true  })
      .order('fecha_creacion', { ascending: false });

    if (error) throw error;

    /* Enriquecer con imagen y precio del producto si hay detalle_id */
    if (alertas.length > 0) {
      const detalleIds = [...new Set(alertas.map(a => a.detalle_id).filter(Boolean))];

      if (detalleIds.length > 0) {
        const { data: productos } = await supabase
          .from('productos')
          .select('id, detalle_id, imagen, precio_actual, url_producto')
          .in('detalle_id', detalleIds);

        const productoMap = {};
        if (productos) {
          productos.forEach(p => { productoMap[p.detalle_id] = p; });
        }

        alertas.forEach(a => {
          const prod = a.detalle_id ? productoMap[a.detalle_id] : null;
          a.imagen          = prod ? prod.imagen        : null;
          a.precio_producto = prod ? prod.precio_actual : null;
          a.producto_url    = prod ? prod.url_producto  : null;
        });
      }
    }

    res.json({ ok: true, alertas });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo alertas' });
  }
});


/* ─────────────────────────────────────────────────────────────
   GET /api/alertas/notificaciones
   Devuelve alertas disparadas no vistas aún.
───────────────────────────────────────────────────────────── */
router.get('/notificaciones', verificarToken, async (req, res) => {
  try {
    const { data: notificaciones, error } = await supabase
      .from('alertas')
      .select('id, producto_nombre, precio_objetivo, precio_min, precio_max, precio_disparado, detalle_id, fecha_disparo')
      .eq('usuario_id',        req.usuario.id)
      .eq('disparada',         true)
      .eq('notificacion_vista', false);

    if (error) throw error;
    res.json({ ok: true, notificaciones });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo notificaciones' });
  }
});


/* ─────────────────────────────────────────────────────────────
   POST /api/alertas/notificaciones/marcar-vistas
───────────────────────────────────────────────────────────── */
router.post('/notificaciones/marcar-vistas', verificarToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('alertas')
      .update({ notificacion_vista: true })
      .eq('usuario_id', req.usuario.id)
      .eq('disparada',  true)
      .eq('notificacion_vista', false);

    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error marcando notificaciones' });
  }
});


/* ────────────────────────────────────────────────────────────
   PATCH /api/alertas/:id/reactivar — reactiva alerta expirada
──────────────────────────────────────────────────────────── */
router.patch('/:id/reactivar', verificarToken, async (req, res) => {
  const { precio_min, precio_max } = req.body;
  try {
    const updateData = {
      activa:         true,
      disparada:      false,
      fecha_creacion: new Date().toISOString()
    };
    if (req.body.precio_objetivo) {
      updateData.precio_objetivo = parseFloat(req.body.precio_objetivo);
    }
    if (precio_min && precio_max) {
      updateData.precio_objetivo = parseFloat(precio_min);
      updateData.precio_min = parseFloat(precio_min);
      updateData.precio_max = parseFloat(precio_max);
    } else {
      updateData.precio_min = null;
      updateData.precio_max = null;
    }
    
    const { error } = await supabase
      .from('alertas')
      .update(updateData)
      .eq('id',         req.params.id)
      .eq('usuario_id', req.usuario.id);
    if (error) throw error;
    res.json({ ok: true, mensaje: 'Alerta reactivada por 21 días más' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error reactivando alerta' });
  }
});

/* ────────────────────────────────────────────────────────────
   PATCH /api/alertas/:id — editar precio objetivo (y rango)
──────────────────────────────────────────────────────────── */
router.patch('/:id', verificarToken, async (req, res) => {
  const { precio_objetivo, precio_min, precio_max } = req.body;

  if (!precio_objetivo || isNaN(parseFloat(precio_objetivo)) || parseFloat(precio_objetivo) <= 0)
    return res.status(400).json({ error: 'precio_objetivo inválido' });

  try {
    const { data: alerta, error: errRead } = await supabase
      .from('alertas')
      .select('producto_nombre')
      .eq('id', req.params.id)
      .eq('usuario_id', req.usuario.id)
      .maybeSingle();
      
    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });

    const { error } = await supabase
      .from('alertas')
      .update({
        precio_objetivo: parseFloat(precio_objetivo),
        precio_min:  precio_min  ? parseFloat(precio_min)  : null,
        precio_max:  precio_max  ? parseFloat(precio_max)  : null,
        fecha_creacion: new Date().toISOString()   // renueva los 21 días
      })
      .eq('id',         req.params.id)
      .eq('usuario_id', req.usuario.id)
      .eq('activa',     true);

    if (error) throw error;
    
    // Send edition email
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('nombre, correo')
      .eq('id', req.usuario.id)
      .maybeSingle();

    if (usuario && precio_min && precio_max) {
      enviarEmailEdicion({
        correo:        usuario.correo,
        nombre:        usuario.nombre,
        producto:      alerta.producto_nombre,
        precioMin:     precio_min,
        precioMax:     precio_max
      }).catch(e => console.error('Error enviando email edición alerta:', e.message));
    }
    
    res.json({ ok: true, mensaje: 'Alerta actualizada correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error actualizando alerta' });
  }
});


/* ─────────────────────────────────────────────────────────────
   DELETE /api/alertas/:id
───────────────────────────────────────────────────────────── */
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { data: alerta, error: errRead } = await supabase
      .from('alertas')
      .select('detalle_id')
      .eq('id',         req.params.id)
      .eq('usuario_id', req.usuario.id)
      .maybeSingle();

    if (errRead) throw errRead;
    if (!alerta)
      return res.status(404).json({ error: 'Alerta no encontrada' });

    const { error: errUpdate } = await supabase
      .from('alertas')
      .update({ activa: false, disparada: false })
      .eq('id',         req.params.id)
      .eq('usuario_id', req.usuario.id);

    if (errUpdate) throw errUpdate;

    res.json({ ok: true, mensaje: 'Alerta eliminada', detalle_id: alerta.detalle_id || null });
  } catch (e) {
    res.status(500).json({ error: 'Error eliminando alerta' });
  }
});





/* ─────────────────────────────────────────────────────────────
   POST /api/alertas/:id/simular-disparo  (solo desarrollo)
───────────────────────────────────────────────────────────── */
router.post('/:id/simular-disparo', verificarToken, async (req, res) => {
  try {
    /* JOIN manual: alertas + usuario */
    const { data: alerta, error: errAlerta } = await supabase
      .from('alertas')
      .select('*')
      .eq('id',         req.params.id)
      .eq('usuario_id', req.usuario.id)
      .maybeSingle();

    if (errAlerta) throw errAlerta;
    if (!alerta)
      return res.status(404).json({ error: 'Alerta no encontrada' });

    const { data: usuario, error: errUsuario } = await supabase
      .from('usuarios')
      .select('nombre, correo')
      .eq('id', req.usuario.id)
      .maybeSingle();

    if (errUsuario) throw errUsuario;

    const precioSimulado = parseFloat(req.body.precio_simulado || alerta.precio_objetivo);

    const { error: errUpdate } = await supabase
      .from('alertas')
      .update({
        disparada:          true,
        notificacion_vista: false,
        precio_disparado:   precioSimulado,
        fecha_disparo:      new Date().toISOString()
      })
      .eq('id', alerta.id);

    if (errUpdate) throw errUpdate;

    await enviarEmailDisparo({
      correo:         usuario.correo,
      nombre:         usuario.nombre,
      producto:       alerta.producto_nombre,
      precioActual:   precioSimulado,
      precioObjetivo: alerta.precio_objetivo,
      precioMin:      alerta.precio_min,
      precioMax:      alerta.precio_max,
      detalleId:      alerta.detalle_id
    });

    res.json({ ok: true, mensaje: 'Disparo simulado y email enviado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error simulando disparo' });
  }
});


/* ── Exportar funciones de email para el monitor ── */
module.exports = router;
module.exports.enviarEmailDisparo    = enviarEmailDisparo;
module.exports.enviarEmailExpiracion = enviarEmailExpiracion;
module.exports.enviarEmailExpirada   = enviarEmailExpirada;

