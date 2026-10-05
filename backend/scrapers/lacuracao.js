/* ================================================================
   PriceScope — scrapers/lacuracao.js
   Extrae Televisores y Smartphones de La Curacao
   Usa Puppeteer (la web bloquea requests directos)
================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Televisores',
    url:       'https://www.lacuracao.pe/electronica/television',
    fuente:    'LaCuracao',
    categoria: 'Televisores'
  },
  {
    nombre:    'Smartphones',
    url:       'https://www.lacuracao.pe/celulares/smartphones',
    fuente:    'LaCuracao',
    categoria: 'Smartphones'
  }
];

async function scrapeLaCuracao() {
  console.log('[LaCuracao] 🚀 Iniciando scraping...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const productos = [];

  try {
    for (const cat of CATEGORIAS) {
      console.log(`[LaCuracao] 📂 Categoría: ${cat.nombre} → ${cat.url}`);
      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1280, height: 900 });

      // Suprimir recursos innecesarios para velocidad
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const tipo = req.resourceType();
        if (['font', 'stylesheet'].includes(tipo)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      try {
        await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 45000 });

        // Esperar que aparezca algún selector de producto
        await page.waitForSelector(
          '[class*="product"], [class*="Product"], [data-product-id], .vtex-search-result, .gallery-item',
          { timeout: 20000 }
        ).catch(() => console.log('[LaCuracao]   ⚠️  Esperando carga alternativa...'));

        // Scroll para forzar lazy-load
        await page.evaluate(async () => {
          for (let i = 0; i < 20; i++) {
            window.scrollBy(0, 800);
            await new Promise(r => setTimeout(r, 500));
          }
        });
        await new Promise(r => setTimeout(r, 2000));

        const items = await page.evaluate((catInfo) => {
          const results = [];

          // La Curacao es VTEX IO — usa clases de vtex render
          // Selectores posibles en orden de prioridad
          const cardSelectors = [
            '[class*="product-summary"]',
            '[class*="productSummary"]',
            '.gallery-item',
            '[data-testid*="product"]',
            '[class*="Product__"]',
            'article[class*="product"]',
            '[class*="vtex-product"]'
          ];

          let cards = [];
          for (const sel of cardSelectors) {
            const found = document.querySelectorAll(sel);
            if (found.length > 0) {
              cards = Array.from(found);
              break;
            }
          }

          if (cards.length === 0) {
            // Último intento: buscar links con precios
            cards = Array.from(document.querySelectorAll('a[href*="/p"]')).map(a => a.closest('article, div[class*="item"], li') || a);
          }

          cards.slice(0, 30).forEach(card => {
            // Nombre del producto
            const nombreEl = card.querySelector(
              '[class*="productName"], [class*="product-name"], [class*="ProductName"], h3, h2, [class*="name"]'
            );
            const nombre = nombreEl ? nombreEl.textContent.trim() : null;
            if (!nombre || nombre.length < 3) return;

            // Precio
            const extraerPrecio = (el) => {
              if (!el) return null;
              const txt = el.textContent.replace(/[^\d.,]/g, '').replace(',', '.');
              const num = parseFloat(txt);
              return isNaN(num) ? null : num;
            };

            const precioOfertaEl = card.querySelector(
              '[class*="sellingPrice"], [class*="SellingPrice"], [class*="bestPrice"], [class*="spot-price"]'
            );
            const precioNormalEl = card.querySelector(
              '[class*="price"]:not([class*="old"]):not([class*="list"]):not([class*="List"])'
            );
            const precioAnteriorEl = card.querySelector(
              '[class*="listPrice"], [class*="ListPrice"], [class*="oldPrice"], [class*="price-old"], del'
            );

            const precioActual = extraerPrecio(precioOfertaEl) || extraerPrecio(precioNormalEl);
            const precioAnterior = extraerPrecio(precioAnteriorEl);
            if (!precioActual || precioActual <= 0) return;

            // Imagen
            const imgEl = card.querySelector('img');
            let imagen = imgEl ? (imgEl.src || imgEl.dataset.src) : null;
            if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

            // URL producto
            const linkEl = card.querySelector('a[href*="/p"], a[href*="lacuracao"]');
            const urlProducto = linkEl ? linkEl.href : null;
            if (!urlProducto) return;

            results.push({
              nombre,
              precio_actual:   precioActual,
              precio_anterior: precioAnterior || null,
              imagen,
              url_producto:    urlProducto,
              fuente:          catInfo.fuente,
              categoria:       catInfo.categoria
            });
          });

          return results;
        }, cat);

        console.log(`[LaCuracao]   ✅ ${items.length} productos encontrados`);
        productos.push(...items);

      } catch (e) {
        console.error(`[LaCuracao]   ❌ Error en ${cat.url}:`, e.message);
      } finally {
        await page.close();
      }

      // Pausa entre categorías
      await new Promise(r => setTimeout(r, 3000));
    }
  } finally {
    await browser.close();
  }

  console.log(`[LaCuracao] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeLaCuracao };
