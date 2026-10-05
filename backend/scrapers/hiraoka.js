/* ================================================================
   PriceScope — scrapers/hiraoka.js
   Extrae Televisores y Smartphones de Hiraoka.com.pe
   Plataforma: Magento 2 (Infracommerce)
   Selectores clave: li.item.product.product-item
================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Televisores',
    url:       'https://hiraoka.com.pe/televisores',
    fuente:    'Hiraoka',
    categoria: 'Televisores'
  },
  {
    nombre:    'Smartphones',
    url:       'https://hiraoka.com.pe/celulares-y-smartphones',
    fuente:    'Hiraoka',
    categoria: 'Smartphones'
  }
];

async function scrapeHiraoka() {
  console.log('[Hiraoka] 🚀 Iniciando scraping...');
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
      console.log(`[Hiraoka] 📂 Categoría: ${cat.nombre}`);
      for (let pagina = 1; pagina <= 3; pagina++) {
        const url = pagina === 1 ? cat.url : `${cat.url}?p=${pagina}`;
        console.log(`[Hiraoka]   → Página ${pagina}: ${url}`);

        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 900 });

        // Bloquear recursos innecesarios para agilizar
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          if (['font', 'media'].includes(req.resourceType())) {
            req.abort();
          } else {
            req.continue();
          }
        });

        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 40000 });

          // Hiraoka es Magento: esperar las cards de producto
          await page.waitForSelector('li.item.product.product-item', { timeout: 20000 })
            .catch(() => console.log('[Hiraoka]   ⚠️  Esperando carga alternativa...'));

        // Scroll para cargar lazy images
        await page.evaluate(async () => {
          for (let i = 0; i < 20; i++) {
            window.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 600));
          }
        });
        await new Promise(r => setTimeout(r, 1500));

        const items = await page.evaluate((catInfo) => {
          const results = [];

          // Magento: cada producto en li.item.product.product-item
          const cards = document.querySelectorAll('li.item.product.product-item');

          cards.forEach((card, idx) => {
            if (idx >= 150) return; // Limite incrementado
            const nombreEl = card.querySelector(
              '.product-item-name a, .product-item-link, a.product-item-photo'
            );
            
            // Usamos innerText en lugar de textContent para evitar extraer código <style> oculto
            let nombre = nombreEl ? nombreEl.innerText.trim() : null;
            
            // Fallback robusto por si innerText falla o arrastra basura CSS de Magento
            if (!nombre || nombre.includes('#html-body') || nombre.includes('{')) {
              const img = card.querySelector('img.product-image-photo');
              if (img && img.alt) {
                nombre = img.alt.trim();
              }
            }

            // Limpiar posibles saltos de línea y espacios extra
            if (nombre) {
              nombre = nombre.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            }

            if (!nombre || nombre.length < 3) return;

            // Precio actual — Magento usa .price dentro de [data-price-type="finalPrice"]
            const precioFinalEl = card.querySelector(
              '[data-price-type="finalPrice"] .price, .special-price .price, .price-box .price'
            );
            const precioAnteriorEl = card.querySelector(
              '[data-price-type="oldPrice"] .price, .old-price .price, .regular-price .price'
            );

            const extraerPrecio = (el) => {
              if (!el) return null;
              const txt = el.textContent.replace(/[^\d.,]/g, '').trim();
              // Hiraoka usa formato "S/ 1,299.00" → remover comas de miles
              const num = parseFloat(txt.replace(/,(\d{3})/g, '$1').replace(',', '.'));
              return isNaN(num) ? null : num;
            };

            const precioActual   = extraerPrecio(precioFinalEl);
            const precioAnterior = extraerPrecio(precioAnteriorEl);
            if (!precioActual || precioActual <= 0) return;

            // Imagen
            const imgEl = card.querySelector('img.product-image-photo') || card.querySelector('img');
            let imagen = null;
            if (imgEl) {
              const src = imgEl.getAttribute('src') || '';
              const dataSrc = imgEl.getAttribute('data-src') || imgEl.dataset?.src || '';
                
              if (dataSrc.length > 5) {
                imagen = dataSrc;
              } else if (src.length > 5 && !src.includes('data:image')) {
                imagen = src;
              }
            }
            if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

            // URL del producto
            const linkEl = card.querySelector('a.product-item-link, a.product-item-photo');
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

        console.log(`[Hiraoka]   ✅ ${items.length} productos encontrados`);
        productos.push(...items);

      } catch (e) {
        console.error(`[Hiraoka]   ❌ Error en ${url}:`, e.message);
      } finally {
        await page.close();
      }
      await new Promise(r => setTimeout(r, 2500));
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`[Hiraoka] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapeHiraoka };
