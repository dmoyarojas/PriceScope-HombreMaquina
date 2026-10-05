require('dotenv').config();
const { scrapeCyC } = require('./scrapers/cyc.js');
const { scrapeSercoplus } = require('./scrapers/sercoplus.js');

async function testPagination() {
  console.log('Testing CyC...');
  await scrapeCyC();
  console.log('Testing Sercoplus...');
  await scrapeSercoplus();
  process.exit(0);
}
testPagination();
