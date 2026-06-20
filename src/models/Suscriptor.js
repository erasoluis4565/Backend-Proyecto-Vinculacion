const mongoose = require('mongoose');

const suscriptorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fechaSuscripcion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Suscriptor', suscriptorSchema);