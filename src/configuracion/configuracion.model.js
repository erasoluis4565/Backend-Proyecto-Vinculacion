const mongoose = require('mongoose');

const configuracionSchema = new mongoose.Schema({
  nombreVivero: { type: String, required: true, trim: true, default: 'Agro Vivero' },
  direccion: { type: String, trim: true },
  telefono: { type: String, trim: true },
  emailContacto: { type: String, trim: true },
  redesSociales: {
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true }
  },
  fechaActualizacion: { type: Date, default: Date.now }
}, {
  collection: 'configuracion',
  timestamps: false
});

module.exports = mongoose.model('Configuracion', configuracionSchema);
