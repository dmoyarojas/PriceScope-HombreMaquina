/* ================================================================
   PriceScope — scrapers/sercoplus.js
   Extrae hardware de Sercoplus (Prestashop)
   Categorías: Tarjetas de Video, Procesadores, Motherboards, Memoria RAM
   ================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Tarjetas de Video',
    url:       'https://sercoplus.com/32-tarjeta-de-video',
    fuente:    'Sercoplus',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Procesadores',
    url:       'https://sercoplus.com/37-procesadores',
    fuente:    'Sercoplus',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Motherboards',
    url:       'https://sercoplus.com/34-mainboard',
    fuente:    'Sercoplus',
    categoria: 'Hardware PC'
  },
  {
    nombre:    'Memoria RAM',
    url:       'https://sercoplus.com/55-memorias-ram',
    fuente:    'Sercoplus',
    categoria: 'Hardware PC'
  }
];

async function scrapeSercoplus() {
  console.log('[Sercoplus] 🚀 Iniciando scraping...');
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
      console.log(`[Sercoplus] 📂 Categoría: ${cat.nombre}`);

      for (let pagina = 1; pagina <= 3; pagina++) {
        const url = pagina === 1 ? cat.url : `${cat.url}?page=${pagina}`;
        console.log(`[Sercoplus]   → Página ${pagina}: ${url}`);

        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 900 });

        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

          // Esperar el listado de productos de Prestashop / Sercoplus
          await page.waitForSelector('.product-miniature, .js-product-miniature', { timeout: 25000 })
            .catch(() => console.log('[Sercoplus]   ⚠️  Esperando carga alternativa...'));

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
          const cards = Array.from(document.querySelectorAll('.product-miniature, .js-product-miniature'));

          const extraerSoles = (txt) => {
            if (!txt) return null;
            // Normalizar espacios y saltos de línea
            const cleanTxt = txt.replace(/\s+/g, ' ').trim();
            
            // Buscar patrón de Soles: S/ o S/. seguido por números con puntos y comas (e.g. S/ 1.399,66)
            const matchSoles = cleanTxt.match(/S\/\.?\s*([\d,.]+)/i);
            if (matchSoles) {
              let str = matchSoles[1];
              if (str.includes('.') && str.includes(',')) {
                // Formato: 1.399,66 -> 1399.66
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

            // Fallback: Buscar dólares ($ / USD) y aplicar Tipo de Cambio
            const matchUSD = cleanTxt.match(/(?:\$|USD)\s*([\d,.]+)/i);
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
                const TC = 3.75;
                return parseFloat((num * TC).toFixed(2));
              }
            }
            return null;
          };

          cards.forEach((card, idx) => {
            if (idx >= 150) return; // Limite incrementado

            // Enlace y URL del producto
            // En Sercoplus está en .tvproduct-image a.thumbnail
            const linkEl = card.querySelector('.tvproduct-image a, .product-thumbnail, a[itemprop="url"], a');
            if (!linkEl) return;
            const urlProducto = linkEl.href;
            if (!urlProducto || urlProducto.includes('#') || urlProducto === '') return;

            // Imagen y Nombre (usamos alt de la imagen o el elemento del título)
            const imgEl = card.querySelector('.tvproduct-defult-img, .tvproduct-image img, img');
            let nombre = imgEl ? imgEl.getAttribute('alt') : null;
            
            // Si el alt no tiene el nombre, buscamos en los enlaces con texto
            if (!nombre || nombre.length < 5) {
              const textLinks = Array.from(card.querySelectorAll('a')).map(a => a.innerText.trim()).filter(t => t.length > 5);
              if (textLinks.length > 0) {
                nombre = textLinks[0];
              }
            }

            if (!nombre || nombre.length < 5) return;

            let imagen = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy')) : null;
            if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

            // Precio
            // Puede estar en .tvproduct-price o .product-price, o en card.innerText
            const priceEl = card.querySelector('.tvproduct-price, .product-price, .price, [class*="price"]');
            const txtPrecio = priceEl ? (priceEl.innerText || priceEl.textContent) : card.innerText;
            const precioActual = extraerSoles(txtPrecio);

            if (!precioActual || precioActual <= 0) return;

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

        console.log(`[Sercoplus]   ✅ ${items.length} productos encontrados en "${cat.nombre}"`);
        productos.push(...items);

      } catch (e) {
        console.error(`[Sercoplus]   ❌ Error en ${url}:`, e.message);
      } finally {
        await page.close();
      }
      await new Promise(r => setTimeout(r, 2000));
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`[Sercoplus] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeSercoplus };
