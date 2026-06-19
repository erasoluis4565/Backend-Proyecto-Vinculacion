const mongoose = require('mongoose');

const fuenteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  url: { type: String, trim: true },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  fechaRegistro: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
}, {
  collection: 'fuentes',
  timestamps: false
});

module.exports = mongoose.model('Fuente', fuenteSchema);
