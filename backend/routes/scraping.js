/* ================================================================
   PriceScope — routes/scraping.js
   Endpoints para ejecutar/consultar el estado del scraping
================================================================ */
const router   = require('express').Router();
const { verificarToken } = require('./auth');

/* Estado en memoria del último scraping */
let ultimoScraping = {
  ejecutando:  false,
  ultimaFecha: null,
  resultado:   null,
  error:       null
};

/* ── POST /api/scraping/ejecutar  (requiere token) ── */
router.post('/ejecutar', verificarToken, async (req, res) => {
  if (ultimoScraping.ejecutando) {
    return res.status(409).json({
      ok: false,
      error: 'Ya hay un scraping en ejecución. Espera a que termine.'
    });
  }

  res.json({ ok: true, mensaje: 'Scraping iniciado en segundo plano. Consulta /api/scraping/estado para ver el resultado.' });

  /* Ejecutar en segundo plano para no bloquear la respuesta */
  ultimoScraping.ejecutando = true;
  ultimoScraping.error = null;

  try {
    const { ejecutarScraping } = require('../scrapers');
    const resultado = await ejecutarScraping();
    ultimoScraping.resultado   = resultado;
    ultimoScraping.ultimaFecha = new Date().toISOString();
    ultimoScraping.ejecutando  = false;
    console.log('[Scraping API] ✅ Scraping manual completado:', resultado);
  } catch (e) {
    console.error('[Scraping API] ❌ Error en scraping manual:', e.message);
    ultimoScraping.error      = e.message;
    ultimoScraping.ejecutando = false;
  }
});

/* ── GET /api/scraping/estado ── */
router.get('/estado', async (req, res) => {
  res.json({
    ok: true,
    estado: ultimoScraping
  });
});

module.exports = router;
module.exports.ultimoScraping = ultimoScraping;
