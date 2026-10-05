/* ================================================================
   PriceScope — scrapers/plazavea.js
   Extrae Televisores y Smartphones de plazaVea (VTEX)
   Usa Puppeteer para renderizar el contenido JS

   Productos capturados:
   - Televisores: Samsung 55"/75"/115", LG 55"/75", Sony 55"/75"
   - Celulares: Samsung, Xiaomi, Apple, Motorola (128GB/256GB)

   Precios capturados:
   - precio_normal:  precio de lista (tachado)
   - precio_oferta:  precio con descuento visible
   - precio_tarjeta: precio exclusivo tarjeta Oh!/Bonus
================================================================ */
const puppeteer = require('puppeteer');

const CATEGORIAS = [
  {
    nombre:    'Televisores',
    url:       'https://www.plazavea.com.pe/tecnologia/televisores',
    fuente:    'PlazaVea',
    categoria: 'Televisores'
  },
  {
    nombre:    'Smartphones',
    url:       'https://www.plazavea.com.pe/tecnologia/celulares-y-smartphones',
    fuente:    'PlazaVea',
    categoria: 'Celulares'
  }
];

const PAGINAS_MAX = 2; // páginas a scrapear por categoría

async function scrapePlazaVea() {
  console.log('[PlazaVea] 🚀 Iniciando scraping...');
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
      console.log(`[PlazaVea] 📂 Categoría: ${cat.nombre}`);

      for (let pagina = 1; pagina <= PAGINAS_MAX; pagina++) {
        const url = pagina === 1 ? cat.url : `${cat.url}?page=${pagina}`;
        console.log(`[PlazaVea]   → Página ${pagina}: ${url}`);

        const page = await browser.newPage();
        await page.setUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 900 });

        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

          // Esperar que carguen los productos
          await page.waitForSelector('.Showcase__name, .showcase__name, [class*="Showcase"]', {
            timeout: 15000
          }).catch(() => console.log('[PlazaVea]   ⚠️  Selector no encontrado, intentando igual'));

          // Scroll para cargar imágenes lazy
          await page.evaluate(() => window.scrollBy(0, 2000));
          await new Promise(r => setTimeout(r, 1500));

          const items = await page.evaluate((catInfo) => {
            const results = [];

            // Plaza Vea usa clase .Showcase para las cards
            const cards = document.querySelectorAll(
              '.Showcase, [class*="showcase-product"], .product-item, [class*="ProductItem"]'
            );

            cards.forEach((card, idx) => {
              if (idx >= 150) return; // Limite incrementado

              // Nombre
              const nombreEl = card.querySelector(
                '.Showcase__name, [class*="Showcase__name"], .product-name, h3, h2'
              );
              const nombre = nombreEl ? nombreEl.textContent.trim() : null;
              if (!nombre || nombre.length < 3) return;

              const extraerPrecio = (el) => {
                if (!el) return null;
                const txt = el.textContent.trim();
                const match = txt.match(/[\d,]+\.?\d*/);
                if (!match) return null;
                const num = parseFloat(match[0].replace(/,(?=\d{3})/g, ''));
                return isNaN(num) || num <= 0 ? null : num;
              };

              // Precio normal (precio de lista, tachado)
              const precioNormalEl = card.querySelector(
                '[class*="listPrice"], [class*="price--old"], [class*="oldPrice"], .Showcase__oldPrice'
              );

              // Precio oferta (precio con descuento visible)
              const precioOfertaEl = card.querySelector(
                '.Showcase__bestPrice, [class*="bestPrice"], [class*="price--best"], [class*="price--new"], .Showcase__salePrice, [class*="salePrice"]'
              );

              // Precio tarjeta Oh!/Bonus (clase específica de PlazaVea)
              const precioTarjetaEl = card.querySelector(
                '[class*="cardPrice"], [class*="card-price"], [class*="ohPrice"], [class*="oh-price"], [class*="bonusPrice"], [class*="tarjeta"]'
              );

              let precioNormal  = extraerPrecio(precioNormalEl);
              let precioOferta  = extraerPrecio(precioOfertaEl);
              let precioTarjeta = extraerPrecio(precioTarjetaEl);

              // Si no hay oferta separada, buscar el precio principal
              if (!precioOferta) {
                const precioMainEl = card.querySelector(
                  '.Showcase__price, [class*="price--current"]'
                );
                precioOferta = extraerPrecio(precioMainEl);
              }

              // Precio actual = el más bajo disponible (tarjeta > oferta)
              let precioActual = precioTarjeta || precioOferta;

              const txtCard = card.textContent.toLowerCase();
              const isAgotado = txtCard.includes('agotado') || txtCard.includes('sin stock') || txtCard.includes('no disponible');

              if (!isAgotado && (!precioActual || precioActual <= 0)) return;
              if (isAgotado && (!precioActual || precioActual <= 0)) {
                // Si está agotado y no hay precio, ponemos 0 o mantenemos nulo para que el frontend lo maneje
                precioActual = 0;
              }

              // Si precio_normal no se detectó, usar el precio_oferta como referencia
              if (!precioNormal || precioNormal <= precioActual) {
                precioNormal = precioOferta !== precioActual ? precioOferta : null;
              }

              // Imagen
              const imgs = Array.from(card.querySelectorAll('img'));
              let imagen = null;
              
              // Buscar la primera imagen que parezca de producto y no un tag o banner
              const validImg = imgs.find(img => {
                const s = img.getAttribute('data-src') || img.getAttribute('src') || '';
                const isPromo = s.toLowerCase().includes('cyber') || s.toLowerCase().includes('-tag-') || s.toLowerCase().includes('sello');
                return s.length > 5 && !s.includes('/tecnologia/') && !isPromo;
              });

              if (validImg) {
                const src = validImg.getAttribute('src');
                const dataSrc = validImg.getAttribute('data-src') || validImg.getAttribute('data-lazy-src') || validImg.dataset.src || validImg.dataset.lazySrc;
                
                if (dataSrc && dataSrc.length > 5) {
                  imagen = dataSrc;
                } else if (src && src.length > 5 && !src.includes('data:image')) {
                  imagen = src;
                } else {
                  imagen = validImg.src;
                }
              }
              if (imagen && imagen.startsWith('//')) imagen = 'https:' + imagen;

              // URL del producto
              const linkEl = card.querySelector('a.Showcase__link, a[href*="/p"], a[class*="link"]');
              let urlProducto = linkEl ? linkEl.href : null;
              if (!urlProducto || urlProducto === window.location.href) {
                const cualquierLink = card.querySelector('a[href]');
                urlProducto = cualquierLink ? cualquierLink.href : null;
              }
              if (!urlProducto) return;

              results.push({
                nombre,
                precio_actual:   precioActual,
                precio_anterior: precioNormal || null,
                precio_normal:   precioNormal || null,
                precio_oferta:   precioOferta || precioActual,
                precio_tarjeta:  precioTarjeta || null,
                imagen,
                url_producto:    urlProducto,
                fuente:          catInfo.fuente,
                categoria:       catInfo.categoria,
                agotado:         isAgotado
              });
            });

            return results;
          }, cat);

          console.log(`[PlazaVea]   ✅ ${items.length} productos en página ${pagina}`);
          productos.push(...items);

        } catch (e) {
          console.error(`[PlazaVea]   ❌ Error en ${url}:`, e.message);
        } finally {
          await page.close();
        }

        // Pausa entre páginas para no sobrecargar
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`[PlazaVea] ✅ Total productos extraídos: ${productos.length}`);
  return productos;
}

module.exports = { scrapePlazaVea };
