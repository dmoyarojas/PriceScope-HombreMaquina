const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.plazavea.com.pe/tecnologia/celulares-y-smartphones?search=iphone%2016', {waitUntil: 'networkidle2'});
  
  await page.waitForSelector('.Showcase, [class*="showcase-product"], .product-item, [class*="ProductItem"]', {timeout: 10000}).catch(()=>console.log("No selector"));
  await page.evaluate(() => window.scrollBy(0, 1000));
  await new Promise(r => setTimeout(r, 1000));
  
  const results = await page.evaluate(() => {
    const cards = document.querySelectorAll('.Showcase, [class*="showcase-product"], .product-item, [class*="ProductItem"]');
    const data = [];
    cards.forEach(card => {
       const title = card.querySelector('.Showcase__name, [class*="Showcase__name"], .product-name, h3, h2')?.textContent.trim();
       if(title && title.toLowerCase().includes('iphone 16')) {
           const prices = Array.from(card.querySelectorAll('[class*="price"], [class*="Price"], span')).map(el => ({
               className: el.className,
               text: el.textContent.trim()
           })).filter(x => x.text && x.text.includes('S/'));
           data.push({ title, prices });
       }
    });
    return data;
  });
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
