/* ================================================================
   test-new-scrapers.js
   Test script to verify the new scrapers without writing to DB.
   ================================================================ */
const { scrapeCyC } = require('../scrapers/cyc');
const { scrapeCompuVision } = require('../scrapers/compuvision');
const { scrapeSercoplus } = require('../scrapers/sercoplus');

async function test() {
  console.log('--- TESTING NEW SCRAPERS ---');
  
  try {
    const cycProd = await scrapeCyC();
    console.log(`\n[CyC Test] Scraped: ${cycProd.length} products`);
    if (cycProd.length > 0) {
      console.log('Sample CyC product:', JSON.stringify(cycProd[0], null, 2));
    }
  } catch (e) {
    console.error('[CyC Test Error]:', e);
  }

  try {
    const cvProd = await scrapeCompuVision();
    console.log(`\n[CompuVision Test] Scraped: ${cvProd.length} products`);
    if (cvProd.length > 0) {
      console.log('Sample CompuVision product:', JSON.stringify(cvProd[0], null, 2));
    }
  } catch (e) {
    console.error('[CompuVision Test Error]:', e);
  }

  try {
    const spProd = await scrapeSercoplus();
    console.log(`\n[Sercoplus Test] Scraped: ${spProd.length} products`);
    if (spProd.length > 0) {
      console.log('Sample Sercoplus product:', JSON.stringify(spProd[0], null, 2));
    }
  } catch (e) {
    console.error('[Sercoplus Test Error]:', e);
  }

  console.log('\n--- TESTING COMPLETE ---');
}

test().catch(console.error);
