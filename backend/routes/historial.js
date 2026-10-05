/* ================================================================
   PriceScope — routes/historial.js
   Historial de precios por nombre de producto
   DB: Supabase JS client (via RPC con funciones PostgreSQL)
================================================================ */
const router   = require('express').Router();
const supabase = require('../db');

/* ── GET /api/historial?nombre=Samsung+TV+55 ── */
router.get('/', async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ error: 'Parámetro nombre requerido' });

  /* Tomar las primeras 3 palabras para el filtro */
  const palabras = nombre.trim().split(' ').slice(0, 3).join(' ');

  try {
    /* Historial agrupado por día (función PostgreSQL definida en supabase_schema.sql) */
    const { data: historial, error: errHist } = await supabase
      .rpc('get_historial_precios', { p_nombre: palabras });

    if (errHist) throw errHist;

    /* Stats generales */
    const { data: statsArr, error: errStats } = await supabase
      .rpc('get_historial_stats', { p_nombre: palabras });

    if (errStats) throw errStats;

    res.json({
      ok: true,
      nombre: palabras,
      stats:     statsArr ? statsArr[0] : null,
      historial: historial || []
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error obteniendo historial' });
  }
});

module.exports = router;
