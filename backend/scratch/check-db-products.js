require('dotenv').config();
const supabase = require('../db');

async function checkProducts() {
  console.log('Fetching products from Supabase...');
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, marca, categoria, precio_actual, fuente');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Total products in Supabase: ${productos.length}`);
  if (productos.length === 0) {
    console.log('No products found in the database.');
    return;
  }

  // Count by category
  const categories = {};
  // Count by brand
  const brands = {};
  // Count by source
  const sources = {};

  productos.forEach(p => {
    categories[p.categoria] = (categories[p.categoria] || 0) + 1;
    brands[p.marca] = (brands[p.marca] || 0) + 1;
    sources[p.fuente] = (sources[p.fuente] || 0) + 1;
  });

  console.log('\n--- Categories ---');
  console.log(categories);

  console.log('\n--- Brands ---');
  console.log(brands);

  console.log('\n--- Sources ---');
  console.log(sources);

  console.log('\n--- Sample Products ---');
  console.log(productos.slice(0, 10));
}

checkProducts().catch(console.error);
