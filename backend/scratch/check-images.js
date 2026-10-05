require('dotenv').config();
const supabase = require('./db');

async function main() {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('id, nombre, imagen, fuente');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  const brokenImages = productos.filter(p => {
    if (!p.imagen) return true;
    if (p.imagen.startsWith('data:image')) return true; // base64 placeholder
    if (p.imagen.includes('loader') || p.imagen.includes('spinner') || p.imagen.includes('placeholder')) return true;
    if (!p.imagen.startsWith('http')) return true; // relative url
    return false;
  });

  console.log(`Total productos: ${productos.length}`);
  console.log(`Productos con imágenes rotas/ausentes/placeholder: ${brokenImages.length}`);

  const bySource = {};
  brokenImages.forEach(p => {
    bySource[p.fuente] = (bySource[p.fuente] || 0) + 1;
  });
  console.log('Rotas por tienda:', bySource);

  console.log('\nEjemplos de imágenes rotas:');
  brokenImages.slice(0, 15).forEach(p => {
    console.log(`- [${p.fuente}] ${p.nombre.substring(0, 40)} -> ${p.imagen}`);
  });

  process.exit(0);
}

main();
