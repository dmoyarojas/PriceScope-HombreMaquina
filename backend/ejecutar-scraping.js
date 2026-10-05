/* ================================================================
   PriceScope — ejecutar-scraping.js
   Script para correr el scraping manualmente desde la terminal.
   Uso: node ejecutar-scraping.js
================================================================ */
require('dotenv').config();

async function main() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   PriceScope — Scraping Manual           ║');
  console.log('╚══════════════════════════════════════════╝\n');
  console.log('⏳ Iniciando... esto puede tardar 3-8 minutos\n');
  console.log('   (Puppeteer abre 4 tiendas con navegador real)\n');

  const { ejecutarScraping } = require('./scrapers');

  try {
    const resultado = await ejecutarScraping();

    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   ✅ Scraping completado                  ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`\n   ➕ Productos nuevos:     ${resultado.insertados}`);
    console.log(`   🔄 Precios actualizados: ${resultado.actualizados}`);
    console.log(`   ❌ Con errores:          ${resultado.errores}`);
    console.log('\n   Los productos ya están disponibles en el catálogo.\n');

  } catch (e) {
    console.error('\n❌ Error fatal en el scraping:', e.message);
    process.exit(1);
  }
}

main();
