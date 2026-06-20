require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rutasSuscriptores = require('./src/routes/suscriptores');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error MongoDB:', err));

// Rutas
app.use('/api', rutasSuscriptores);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando 🚀' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});