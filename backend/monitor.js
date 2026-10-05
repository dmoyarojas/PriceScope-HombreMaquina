/* ================================================================
   PriceScope — monitor.js
   Cron 1: revisa alertas activas cada 2 minutos.
   Cron 2: scraping de La Curacao y Plaza Vea (diario 3AM).
   DB: Supabase JS client
================================================================ */
const cron     = require('node-cron');
const supabase = require('./db');
const { enviarEmailDisparo, enviarEmailExpiracion, enviarEmailExpirada } = require('./routes/alertas');
const { ejecutarScraping }   = require('./scrapers');



/* ─────────────────────────────────────────────────────────────
   Obtener precio actual desde la tabla productos
───────────────────────────────────────────────────────────── */
async function getPrecioActual(detalleId, productoNombre) {
  /* 1. Intentar por detalle_id (match exacto) */
  if (detalleId) {
    const { data } = await supabase
      .from('productos')
      .select('precio_actual')
      .eq('detalle_id', detalleId)
      .eq('activo', true)
      .limit(1)
      .maybeSingle();

    if (data) return parseFloat(data.precio_actual);
  }

  /* 2. Fallback: buscar por nombre (primeras 4 palabras) */
  const palabras = productoNombre.trim().split(' ').slice(0, 4).join(' ');
  const { data } = await supabase
    .from('productos')
    .select('precio_actual')
    .ilike('nombre', `%${palabras}%`)
    .eq('activo', true)
    .limit(1)
    .maybeSingle();

  return data ? parseFloat(data.precio_actual) : null;
}


/* ─────────────────────────────────────────────────────────────
   Verificar si el precio cumple el objetivo de la alerta
───────────────────────────────────────────────────────────── */
function precioAlcanzaObjetivo(precioActual, alerta) {
  if (alerta.precio_min && alerta.precio_max) {
    return precioActual >= parseFloat(alerta.precio_min) &&
           precioActual <= parseFloat(alerta.precio_max);
  }
  return precioActual <= parseFloat(alerta.precio_objetivo);
}


/* ─────────────────────────────────────────────────────────────
   Tarea principal
───────────────────────────────────────────────────────────── */
async function revisarAlertas() {
  console.log('[Monitor] Iniciando revisión de alertas…');

  /* Obtener alertas activas + datos del usuario */
  const { data: alertasRaw, error } = await supabase
    .from('alertas')
    .select('id, producto_nombre, precio_objetivo, precio_min, precio_max, detalle_id, usuario_id')
    .eq('activa',    true)
    .eq('disparada', false);

  if (error) {
    console.error('[Monitor] Error leyendo alertas:', error.message);
    return;
  }

  if (!alertasRaw || !alertasRaw.length) {
    console.log('[Monitor] Sin alertas activas.');
    return;
  }

  /* Obtener usuarios únicos involucrados */
  const usuarioIds = [...new Set(alertasRaw.map(a => a.usuario_id))];
  const { data: usuarios } = await supabase
    .from('usuarios')
    .select('id, nombre, correo')
    .in('id', usuarioIds);

  const usuarioMap = {};
  if (usuarios) usuarios.forEach(u => { usuarioMap[u.id] = u; });

  const alertas = alertasRaw.map(a => ({
    ...a,
    correo: usuarioMap[a.usuario_id]?.correo || null,
    nombre: usuarioMap[a.usuario_id]?.nombre || null
  }));

  console.log(`[Monitor] Revisando ${alertas.length} alerta(s)…`);

  for (const alerta of alertas) {
    try {
      const precioActual = await getPrecioActual(alerta.detalle_id, alerta.producto_nombre);

      if (precioActual === null) {
        console.log(`[Monitor] Sin precio para: ${alerta.producto_nombre}`);
        continue;
      }

      /* Guardar precio_actual en la alerta */
      await supabase
        .from('alertas')
        .update({ precio_actual: precioActual })
        .eq('id', alerta.id);

      console.log(`[Monitor] "${alerta.producto_nombre}" → S/ ${precioActual} | objetivo: S/ ${alerta.precio_objetivo}`);

      if (!precioAlcanzaObjetivo(precioActual, alerta)) continue;

      /* ── PRECIO ALCANZADO ── */
      console.log(`[Monitor] 🎯 Objetivo alcanzado — alerta #${alerta.id} (${alerta.correo})`);

      await supabase
        .from('alertas')
        .update({
          disparada:          true,
          notificacion_vista: false,
          precio_disparado:   precioActual,
          fecha_disparo:      new Date().toISOString()
        })
        .eq('id', alerta.id);

      if (alerta.correo) {
        await enviarEmailDisparo({
          correo:         alerta.correo,
          nombre:         alerta.nombre,
          producto:       alerta.producto_nombre,
          precioActual:   precioActual,
          precioObjetivo: alerta.precio_objetivo,
          precioMin:      alerta.precio_min,
          precioMax:      alerta.precio_max,
          detalleId:      alerta.detalle_id
        });
        console.log(`[Monitor] ✉️  Email enviado a ${alerta.correo}`);
      }

    } catch (e) {
      console.error(`[Monitor] Error procesando alerta #${alerta.id}:`, e.message);
    }
  }

  console.log('[Monitor] Revisión completa.');
}


/* ─────────────────────────────────────────────────────────────
   Cron 1: Revisar alertas cada 2 minutos
───────────────────────────────────────────────────────────── */
cron.schedule('*/2 * * * *', () => {
  revisarAlertas().catch(e => console.error('[Monitor] Error inesperado:', e.message));
});

/* ─────────────────────────────────────────────────────────────
   Cron 2: Scraping de La Curacao y Plaza Vea — todos los días a las 3AM
   Para pruebas en desarrollo, usa /api/scraping/ejecutar
───────────────────────────────────────────────────────────── */
cron.schedule('0 3 * * *', () => {
  console.log('[Monitor] 🕐 Cron scraping diario iniciado...');
  ejecutarScraping().catch(e => console.error('[Monitor] Error en scraping diario:', e.message));
});


/* ─────────────────────────────────────────────────────────────
   Verificar expiración de alertas (Mejora 7)
   - Alertas que expiran en 3 días: email de aviso
   - Alertas ya expiradas (>21 días): marcar inactivas + email
───────────────────────────────────────────────────────────── */
async function verificarExpiraciones() {
  console.log('[Monitor] 🕐 Verificando expiraciones de alertas...');

  const DURACION_DIAS = 21;
  const ELIMINACION_DIAS = 14;

  try {
    // Obtener todas las alertas activas con sus usuarios
    const { data: alertas, error } = await supabase
      .from('alertas')
      .select('id, usuario_id, producto_nombre, fecha_creacion')
      .eq('activa', true)
      .eq('disparada', false);

    if (error) throw error;
    if (!alertas || alertas.length === 0) return;

    const ahora = new Date();

    for (const alerta of alertas) {
      const fechaCreacion = new Date(alerta.fecha_creacion);
      const msDiff = ahora - fechaCreacion;
      const diasTranscurridos = msDiff / (1000 * 60 * 60 * 24);
      const diasRestantes = Math.ceil(DURACION_DIAS - diasTranscurridos);

      // Obtener datos del usuario
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('nombre, correo')
        .eq('id', alerta.usuario_id)
        .maybeSingle();

      if (!usuario) continue;

      if (diasRestantes <= 0) {
        // Alerta expirada: desactivar y enviar email
        await supabase.from('alertas').update({ activa: false }).eq('id', alerta.id);
        enviarEmailExpirada({
          correo:   usuario.correo,
          nombre:   usuario.nombre,
          producto: alerta.producto_nombre
        }).catch(e => console.error(`[Monitor] Error email expirada #${alerta.id}:`, e.message));
        console.log(`[Monitor] ⚠️  Alerta #${alerta.id} expirada y desactivada.`);

      } else if (diasRestantes === 3 || diasRestantes === 1) {
        // Próxima a expirar: enviar aviso
        enviarEmailExpiracion({
          correo:        usuario.correo,
          nombre:        usuario.nombre,
          producto:      alerta.producto_nombre,
          diasRestantes: diasRestantes
        }).catch(e => console.error(`[Monitor] Error email aviso #${alerta.id}:`, e.message));
        console.log(`[Monitor] 📧 Aviso expiración #${alerta.id} → ${diasRestantes} días.`);
      }
    }

    // Auto-eliminar alertas inactivas que llevan > 14 días expiradas
    const { data: inactivas, error: errInact } = await supabase
      .from('alertas')
      .select('id, fecha_creacion')
      .eq('activa', false);

    if (!errInact && inactivas) {
      for (const alerta of inactivas) {
        const fechaCreacion = new Date(alerta.fecha_creacion);
        const diasTranscurridos = (ahora - fechaCreacion) / (1000 * 60 * 60 * 24);
        // Si han pasado más de 21 + 14 días
        if (diasTranscurridos >= (DURACION_DIAS + ELIMINACION_DIAS)) {
          await supabase.from('alertas').delete().eq('id', alerta.id);
          console.log(`[Monitor] 🗑️ Alerta #${alerta.id} eliminada automáticamente (>14 días expirada).`);
        }
      }
    }

    console.log('[Monitor] ✅ Revisión de expiraciones completa.');
  } catch (e) {
    console.error('[Monitor] Error en verificarExpiraciones:', e.message);
  }
}

/* Cron 3: Verificar expiraciones — todos los días a las 8AM */
cron.schedule('0 8 * * *', () => {
  verificarExpiraciones().catch(e => console.error('[Monitor] Error expiraciones:', e.message));
});

console.log('[Monitor] ✅ Cron alertas activo — cada 2 minutos.');
console.log('[Monitor] ✅ Cron scraping activo — todos los días a las 3AM.');
console.log('[Monitor] ✅ Cron expiraciones activo — todos los días a las 8AM.');

/* Ejecutar una vez al arrancar (útil en desarrollo) */
if (process.env.NODE_ENV !== 'production') {
  setTimeout(() => {
    revisarAlertas().catch(e => console.error('[Monitor] Error en arranque:', e.message));
  }, 3000);
}

module.exports = { revisarAlertas, verificarExpiraciones };