/* ================================================================
   PriceScope — routes/productos.js
   Productos desde Supabase (PostgreSQL)
================================================================ */
const router   = require('express').Router();
const supabase = require('../db');
const { verificarToken } = require('./auth');

/* ─────────────────────────────────────────────────────────────
   GET /api/productos
   Devuelve todos los productos activos.
   Acepta ?categoria=Televisores para filtrar.
───────────────────────────────────────────────────────────── */
router.get('/', async (req, res) => {
  const { categoria } = req.query;

  try {
    let query = supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('categoria', { ascending: true })
      .order('nombre',    { ascending: true });

    if (categoria && categoria !== 'Todas las categorías') {
      query = query.eq('categoria', categoria);
    }

    const { data: productos, error } = await query;
    if (error) throw error;

    res.json({ ok: true, total: productos.length, productos });
  } catch (e) {
    console.error('[Productos] Error GET /:', e.message);
    res.status(500).json({ ok: false, error: 'Error obteniendo productos' });
  }
});


/* ─────────────────────────────────────────────────────────────
   GET /api/productos/:id
   Devuelve un producto por su id.
───────────────────────────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  try {
    const { data: producto, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', req.params.id)
      .eq('activo', true)
      .maybeSingle();

    if (error) throw error;
    if (!producto)
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });

    // Obtener historial de precios (primeras 3 palabras del nombre)
    const palabras = producto.nombre.trim().split(' ').slice(0, 3).join(' ');
    const { data: historialRaw } = await supabase
      .rpc('get_historial_precios', { p_nombre: palabras });

    let historial = null;
    if (historialRaw && historialRaw.length > 0) {
      const grouped = {};
      for (const row of historialRaw) {
        // row.fecha viene como 'YYYY-MM-DD HH24:MI'
        const date = row.fecha.split(' ')[0];
        const price = parseFloat(row.precio_minimo);
        if (!grouped[date] || price < grouped[date]) {
          grouped[date] = price;
        }
      }
      historial = Object.keys(grouped).sort().map(date => ({
        f: date,
        p: grouped[date]
      }));
    }

    res.json({ ok: true, producto, historial });
  } catch (e) {
    console.error('[Productos] Error GET /:id:', e.message);
    res.status(500).json({ ok: false, error: 'Error obteniendo producto' });
  }
});


/* ─────────────────────────────────────────────────────────────
   PATCH /api/productos/:id/precio     ← requiere token
   Actualiza el precio actual de un producto.
   Body: { precio_nuevo: 1999.00 }
───────────────────────────────────────────────────────────── */
router.patch('/:id/precio', verificarToken, async (req, res) => {
  const { precio_nuevo } = req.body;

  if (precio_nuevo === undefined || isNaN(parseFloat(precio_nuevo)) || parseFloat(precio_nuevo) <= 0)
    return res.status(400).json({ ok: false, error: 'precio_nuevo debe ser un número positivo' });

  const precioNuevo = parseFloat(precio_nuevo);

  try {
    /* Leer precio actual antes de actualizar */
    const { data: producto, error: errLeer } = await supabase
      .from('productos')
      .select('id, nombre, precio_actual')
      .eq('id', req.params.id)
      .eq('activo', true)
      .maybeSingle();

    if (errLeer) throw errLeer;
    if (!producto)
      return res.status(404).json({ ok: false, error: 'Producto no encontrado' });

    const precioAnterior = parseFloat(producto.precio_actual);

    /* Actualizar precio — el anterior pasa a precio_anterior */
    const { error: errUpdate } = await supabase
      .from('productos')
      .update({ precio_anterior: producto.precio_actual, precio_actual: precioNuevo })
      .eq('id', req.params.id);

    if (errUpdate) throw errUpdate;

    /* Registrar en historial_precios */
    const { error: errHist } = await supabase
      .from('historial_precios')
      .insert({ producto_nombre: producto.nombre, precio: precioNuevo, fuente: 'Simulado', url_producto: null });

    if (errHist) throw errHist;

    console.log(`[Productos] 💰 ${producto.nombre}: S/ ${precioAnterior} → S/ ${precioNuevo}`);

    res.json({
      ok: true,
      mensaje: 'Precio actualizado correctamente',
      producto_id: req.params.id,
      precio_anterior: precioAnterior,
      precio_nuevo: precioNuevo
    });

  } catch (e) {
    console.error('[Productos] Error PATCH /:id/precio:', e.message);
    res.status(500).json({ ok: false, error: 'Error actualizando precio' });
  }
});

module.exports = router;