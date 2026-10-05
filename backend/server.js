/* ================================================================
   PriceScope — server.js
================================================================ */
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const cors    = require('cors');
const app     = express();
const PORT    = process.env.PORT || 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

/* ── Servir frontend estático ── */
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));


/* ── Rutas ── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/alertas',   require('./routes/alertas'));
app.use('/api/historial', require('./routes/historial'));
app.use('/api/scraping',  require('./routes/scraping'));

/* ── Salud ── */
app.get('/', (req, res) => {
  res.json({ status: 'PriceScope backend corriendo ✅', port: PORT });
});

/* ── Monitor ── */
require('./monitor');

app.listen(PORT, () => {
  console.log(`✅ PriceScope backend en http://localhost:${PORT}`);
});