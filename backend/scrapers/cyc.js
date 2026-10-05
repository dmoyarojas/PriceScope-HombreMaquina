/* ================================================================
   PriceScope — scrapers/cyc.js
   Extrae hardware de C&C Computer (Prestashop)
   Categorías: Tarjetas de Video, Procesadores, Memoria RAM
   ================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Tarjetas de Video',
    url:       'https://cyccomputer.pe/categoria/234-tarjetas-graficas',
    fuente:    'CyC',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Procesadores',
    url:       'https://cyccomputer.pe/categoria/254-procesadores-accesorios',
    fuente:    'CyC',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Memoria RAM',
    url:       'https://cyccomputer.pe/categoria/796-memorias-ram',
    fuente:    'CyC',
    categoria: 'Hardware PC'
  }
];

async function scrapeCyC() {
  console.log('[CyC] 🚀 Iniciando scraping...');
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
      console.log(`[CyC] 📂 Categoría: ${cat.nombre}`);

      for (let pagina = 1; pagina <= 3; pagina++) {
        const url = pagina === 1 ? cat.url : `${cat.url}?page=${pagina}`;
        console.log(`[CyC]   → Página ${pagina}: ${url}`);

        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 900 });

        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

          // Esperar el listado de productos de Prestashop
          await page.waitForSelector('.product-miniature, .product-container', { timeout: 25000 })
            .catch(() => console.log('[CyC]   ⚠️  Esperando carga alternativa...'));

          // Scroll para activar lazy loading de imágenes
        await page.evaluate(async () => {
          for (let i = 0; i < 20; i++) {
            window.scrollBy(0, 800);
            await new Promise(r => setTimeout(r, 600));
          }
        });
        await new Promise(r => setTimeout(r, 2000));

        const items = await page.evaluate((catInfo) => {
          const results = [];
          const TC = 3.70;

          // Seleccionar miniaturas de Prestashop
          const cards = Array.from(document.querySelectorAll('.product-miniature'));

          // Función robusta para extraer precios en Soles o USD
          const extraerSoles = (txt) => {
            if (!txt) return null;
            
            // Buscar S/ o S/.
            const matchSoles = txt.match(/S\/\.?\s*([\d,.]+)/i);
            if (matchSoles) {
              let str = matchSoles[1];
              if (str.includes('.') && str.includes(',')) {
                // Formato: 1.509,45 -> 1509.45
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
            
            // Si no hay Soles, buscar dólares ($ / USD)
            const matchUSD = txt.match(/(?:\$|USD)\s*([\d,.]+)/i);
            if (matchUSD) {
              let str = matchUSD[1];
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
              if (!isNaN(num) && num > 0) {
                return parseFloat((num * TC).toFixed(2));
              }
            }
            return null;
          };

          cards.forEach((card, idx) => {
            if (idx >= 150) return; // Limite incrementado

            // Nombre y URL
            const titleLink = card.querySelector('.productName a, .product-title a, h2 a, h3 a');
            if (!titleLink) return;

            const nombre = titleLink.innerText.trim();
            const urlProducto = titleLink.href;
            if (!nombre || nombre.length < 5 || !urlProducto) return;

            // Precio
            const priceEl = card.querySelector('.price, .product-price, [class*="price"]');
            const precioActual = priceEl ? extraerSoles(priceEl.innerText || priceEl.textContent) : null;
            if (!precioActual || precioActual <= 0) return;

            // Imagen
            const imgEl = card.querySelector('.product-thumbnail img, .laberProduct-image img, img');
            let imagen = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy')) : null;
            if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

            results.push({
              nombre:          nombre.replace(/\s+/g, ' ').trim(),
              precio_actual:   precioActual,
              precio_anterior: null,
              imagen,
              url_producto:    urlProducto,
              fuente:          catInfo.fuente,
              categoria:       catInfo.categoria
            });
          });

          return results;
        }, cat);

        console.log(`[CyC]   ✅ ${items.length} productos encontrados en "${cat.nombre}"`);
        productos.push(...items);

      } catch (e) {
        console.error(`[CyC]   ❌ Error en ${url}:`, e.message);
      } finally {
        await page.close();
      }
      await new Promise(r => setTimeout(r, 2000));
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`[CyC] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeCyC };
