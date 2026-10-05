/* ================================================================
   PriceScope — scrapers/compuvision.js
   Extrae hardware de CompuVision (Custom Bootstrap)
   Categorías: Tarjetas de Video, Procesadores, Motherboards, Memoria RAM
   ================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Tarjetas de Video',
    url:       'https://compuvisionperu.pe/CYM/shop-list-ctg.php?ctg=003-044-004',
    fuente:    'CompuVision',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Procesadores',
    url:       'https://compuvisionperu.pe/CYM/shop-list-ctg.php?ctg=001',
    fuente:    'CompuVision',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Motherboards',
    url:       'https://compuvisionperu.pe/CYM/shop-list-ctg.php?ctg=002',
    fuente:    'CompuVision',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Memoria RAM',
    url:       'https://compuvisionperu.pe/CYM/shop-list-ctg.php?ctg=005',
    fuente:    'CompuVision',
    categoria: 'Hardware PC'
  }
];

async function scrapeCompuVision() {
  console.log('[CompuVision] 🚀 Iniciando scraping...');
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
      console.log(`[CompuVision] 📂 Categoría: ${cat.nombre}`);
      const page = await browser.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      await page.setViewport({ width: 1280, height: 900 });

      try {
        await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Esperar el listado de productos de CompuVision
        await page.waitForSelector('.product, [class*="product"]', { timeout: 25000 })
          .catch(() => console.log('[CompuVision]   ⚠️  Esperando carga alternativa...'));

        // Scroll para cargar todos los productos
        await page.evaluate(async () => {
          for (let i = 0; i < 20; i++) {
            window.scrollBy(0, 800);
            await new Promise(r => setTimeout(r, 600));
          }
        });
        await new Promise(r => setTimeout(r, 2000));

        const items = await page.evaluate((catInfo, baseUrl) => {
          const results = [];
          const cards = Array.from(document.querySelectorAll('.product'));

          const extraerSoles = (txt) => {
            if (!txt) return null;
            // Buscar Soles especificando S/. o S/
            const matchSoles = txt.match(/S\/\.?\s*([\d,.]+)/i);
            if (matchSoles) {
              let str = matchSoles[1];
              // Limpiar puntuaciones
              if (str.includes('.') && str.includes(',')) {
                str = str.replace(/\./g, '').replace(',', '.');
              } else if (str.includes(',')) {
                if (/,(\d{2})$/.test(str)) {
                  str = str.replace(',', '.');
                } else {
                  str = str.replace(/,/g, '');
                }
              }
              const num = parseFloat(str);
              if (!isNaN(num) && num > 0) return num;
            }
            return null;
          };

          cards.forEach((card, idx) => {
            if (idx >= 150) return; // Limite incrementado
            const titleLink = card.querySelector('h6.product_title a, .product_title a');
            if (!titleLink) return;

            const nombre = titleLink.innerText.trim();
            let rawUrl = titleLink.getAttribute('href');
            if (!nombre || nombre.length < 5 || !rawUrl) return;

            // Resolver URL absoluta del producto
            // Si el href es shop-product-detail.php?prod=4875, lo resolvemos contra el baseUrl
            let urlProducto = rawUrl;
            if (!rawUrl.startsWith('http')) {
              // Limpiar ruta relativa simple
              const path = rawUrl.replace(/^\.\//, '').replace(/^\.\.\//, '');
              urlProducto = 'https://compuvisionperu.pe/CYM/' + path;
            }

            // Precio
            const priceBlock = card.querySelector('.product_price, [class*="price"]');
            let precioActual = priceBlock ? extraerSoles(priceBlock.innerText || priceBlock.textContent) : null;

            const txtCard = card.textContent.toLowerCase();
            const isAgotado = txtCard.includes('agotado') || txtCard.includes('sin stock') || txtCard.includes('no disponible');

            if (!isAgotado && (!precioActual || precioActual <= 0)) return;
            if (isAgotado && (!precioActual || precioActual <= 0)) {
              precioActual = 0;
            }

            // Imagen
            const imgEl = card.querySelector('.product_img img, img');
            let rawImg = imgEl ? (imgEl.src || imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) : null;
            let imagen = rawImg;
            if (rawImg && !rawImg.startsWith('http')) {
              // Limpiar ruta relativa: ../public/img/... -> public/img/...
              const imgPath = rawImg.replace(/^\.\.\//, '').replace(/^\.\//, '');
              imagen = 'https://compuvisionperu.pe/' + imgPath;
            }

            results.push({
              nombre:          nombre.replace(/\s+/g, ' ').trim(),
              precio_actual:   precioActual,
              precio_anterior: null,
              imagen,
              url_producto:    urlProducto,
              fuente:          catInfo.fuente,
              categoria:       catInfo.categoria,
              agotado:         isAgotado
            });
          });

          return results;
        }, cat, cat.url);

        console.log(`[CompuVision]   ✅ ${items.length} productos encontrados en "${cat.nombre}"`);
        productos.push(...items);

      } catch (e) {
        console.error(`[CompuVision]   ❌ Error en ${cat.url}:`, e.message);
      } finally {
        await page.close();
      }

      await new Promise(r => setTimeout(r, 2000));
    }
  } finally {
    await browser.close();
  }

  console.log(`[CompuVision] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeCompuVision };
