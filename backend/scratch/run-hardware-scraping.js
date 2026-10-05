/* ================================================================
   run-hardware-scraping.js
   Runs only the hardware scrapers and saves products to the DB.
   ================================================================ */
require('dotenv').config();

const { scrapeWilson } = require('../scrapers/wilson');
const { scrapeImpacto } = require('../scrapers/impacto');
const { scrapeCyC } = require('../scrapers/cyc');
const { scrapeCompuVision } = require('../scrapers/compuvision');
const { scrapeSercoplus } = require('../scrapers/sercoplus');
const { guardarProductos } = require('../scrapers/index');

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   PriceScope — Scraping Hardware PC      ║');
  console.log('╚══════════════════════════════════════════╝\n');
  const inicio = Date.now();

  let todosLosProductos = [];

  /* Wilson */
  try {
    const wlProductos = await scrapeWilson();
    todosLosProductos.push(...wlProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Wilson:', e.message);
  }

  /* Impacto */
  try {
    const imProductos = await scrapeImpacto();
    todosLosProductos.push(...imProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Impacto:', e.message);
  }

  /* CyC */
  try {
    const cyProductos = await scrapeCyC();
    todosLosProductos.push(...cyProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en CyC:', e.message);
  }

  /* CompuVision */
  try {
    const cvProductos = await scrapeCompuVision();
    todosLosProductos.push(...cvProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en CompuVision:', e.message);
  }

  /* Sercoplus */
  try {
    const spProductos = await scrapeSercoplus();
    todosLosProductos.push(...spProductos);
  } catch (e) {
    console.error('[Scrapers] ❌ Error en Sercoplus:', e.message);
  }

  console.log(`\n[Scrapers] 📦 Total productos hardware scrapeados: ${todosLosProductos.length}`);

  /* Guardar en Supabase */
  if (todosLosProductos.length > 0) {
    const stats = await guardarProductos(todosLosProductos);
    const duracion = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`\n[Scrapers] ✅ Completado en ${duracion}s`);
    console.log(`[Scrapers]    ➕ Insertados: ${stats.insertados}`);
    console.log(`[Scrapers]    🔄 Actualizados: ${stats.actualizados}`);
    console.log(`[Scrapers]    ❌ Errores: ${stats.errores}`);
  } else {
    console.log('[Scrapers] ⚠️  No se extrajo ningún producto');
  }
}

main().catch(console.error);
