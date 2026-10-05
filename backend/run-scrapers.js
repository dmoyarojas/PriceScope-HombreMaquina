require('dotenv').config();
const { ejecutarScraping } = require('./scrapers/index.js');

async function main() {
  console.log('🚀 Iniciando scraping masivo de todos los productos (límites incrementados)...');
  await ejecutarScraping();
  console.log('✅ Proceso finalizado.');
  process.exit(0);
}

main();
