require('dotenv').config();
const supabase = require('../db');

const seedProducts = [
  // --- Televisores ---
  {
    id: 'seed-tv-samsung-115',
    nombre: 'Televisor Samsung 115" Neo QLED 8K Smart TV QN900D',
    marca: 'Samsung',
    categoria: 'Televisores',
    precio_actual: 45999.00,
    precio_anterior: 49999.00,
    precio_normal: 49999.00,
    precio_oferta: 45999.00,
    imagen: 'https://images.samsung.com/is/image/samsung/p6pim/levant/qn55q70cafxza/gallery/levant-qled-q70c-qn55q70cafxza-536919466?$650_519_PNG$',
    url_producto: 'https://www.samsung.com/pe/tvs/neo-qled-8k/qn900d-115-inch/',
    fuente: 'Samsung Store',
    detalle_id: 'seed-tv-samsung-115',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  {
    id: 'seed-tv-lg-115',
    nombre: 'Televisor LG OLED evo 115" M4 4K Smart TV',
    marca: 'LG',
    categoria: 'Televisores',
    precio_actual: 39999.00,
    precio_anterior: 42999.00,
    precio_normal: 42999.00,
    precio_oferta: 39999.00,
    imagen: 'https://www.lg.com/us/images/tvs/md08003672/gallery/medium01.jpg',
    url_producto: 'https://www.lg.com/pe/televisores/lg-oled115m4psa',
    fuente: 'LG Store',
    detalle_id: 'seed-tv-lg-115',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  {
    id: 'seed-tv-sony-55',
    nombre: 'Televisor Sony Bravia 7 55" Mini LED 4K K-55XR70',
    marca: 'Sony',
    categoria: 'Televisores',
    precio_actual: 4299.00,
    precio_anterior: 4899.00,
    precio_normal: 4899.00,
    precio_oferta: 4299.00,
    imagen: 'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    url_producto: 'https://store.sony.com.pe/k-55xr70/p',
    fuente: 'Sony Store',
    detalle_id: 'seed-tv-sony-55',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  {
    id: 'seed-tv-sony-75',
    nombre: 'Televisor Sony Bravia 9 75" Mini LED 4K K-75XR90',
    marca: 'Sony',
    categoria: 'Televisores',
    precio_actual: 11999.00,
    precio_anterior: 12999.00,
    precio_normal: 12999.00,
    precio_oferta: 11999.00,
    imagen: 'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    url_producto: 'https://store.sony.com.pe/k-75xr90/p',
    fuente: 'Sony Store',
    detalle_id: 'seed-tv-sony-75',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  {
    id: 'seed-tv-sony-115',
    nombre: 'Televisor Sony Bravia 115" 8K LED Master Series Z9K',
    marca: 'Sony',
    categoria: 'Televisores',
    precio_actual: 42999.00,
    precio_anterior: 45999.00,
    precio_normal: 45999.00,
    precio_oferta: 42999.00,
    imagen: 'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=440',
    url_producto: 'https://store.sony.com.pe/z9k-115/p',
    fuente: 'Sony Store',
    detalle_id: 'seed-tv-sony-115',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  
  // --- Smartphones ---
  {
    id: 'seed-cel-xiaomi-128',
    nombre: 'Celular Xiaomi Redmi Note 13 Pro 128GB 8GB RAM',
    marca: 'Xiaomi',
    categoria: 'Smartphones',
    precio_actual: 899.00,
    precio_anterior: 1099.00,
    precio_normal: 1099.00,
    precio_oferta: 899.00,
    imagen: 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0/pms_1708336920.35303497.png',
    url_producto: 'https://www.mi.com/pe/product/redmi-note-13-pro/',
    fuente: 'Xiaomi Store',
    detalle_id: 'seed-cel-xiaomi-128',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  {
    id: 'seed-cel-motorola-128',
    nombre: 'Celular Motorola Moto G54 5G 128GB 8GB RAM',
    marca: 'Motorola',
    categoria: 'Smartphones',
    precio_actual: 749.00,
    precio_anterior: 899.00,
    precio_normal: 899.00,
    precio_oferta: 749.00,
    imagen: 'https://motorolaus.vtexassets.com/arquivos/ids/163273/moto-g54-pdp-render-out-1.png',
    url_producto: 'https://www.motorola.com.pe/moto-g54-5g/p',
    fuente: 'Motorola Store',
    detalle_id: 'seed-cel-motorola-128',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  },
  {
    id: 'seed-cel-motorola-256',
    nombre: 'Celular Motorola Edge 50 Pro 256GB 12GB RAM',
    marca: 'Motorola',
    categoria: 'Smartphones',
    precio_actual: 2299.00,
    precio_anterior: 2699.00,
    precio_normal: 2699.00,
    precio_oferta: 2299.00,
    imagen: 'https://motorolaus.vtexassets.com/arquivos/ids/163273/moto-g54-pdp-render-out-1.png', // fallback image
    url_producto: 'https://www.motorola.com.pe/edge-50-pro/p',
    fuente: 'Motorola Store',
    detalle_id: 'seed-cel-motorola-256',
    activo: true,
    fecha_actualizacion: new Date().toISOString()
  }
];

async function seed() {
  console.log('Seeding missing products to Supabase...');
  
  for (const p of seedProducts) {
    const { error } = await supabase
      .from('productos')
      .upsert(p);

    if (error) {
      console.error(`Error seeding ${p.nombre}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${p.nombre}`);
    }
  }

  console.log('Seeding complete.');
}

seed().catch(console.error);
