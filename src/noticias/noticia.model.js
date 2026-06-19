const mongoose = require('mongoose');

// Portada de la noticia (imagen alojada en Cloudinary)
const portadaSchema = new mongoose.Schema({
  secureUrl: { type: String, default: '' },
  publicId: { type: String, default: '' }
}, { _id: false });

const noticiaSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  titulo: { type: String, required: true, trim: true },
  resumen: { type: String, required: true, trim: true },
  contenido: { type: String, required: true },
  categoria: { type: String, trim: true, default: '' },
  autorCorreo: { type: String, trim: true, default: '' },
  portada: { type: portadaSchema, default: {} },
  // IDs de la colección multimedia asociados a esta noticia
  multimediaIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Multimedia' }],
  estado: { type: String, enum: ['BORRADOR', 'PUBLICADO', 'INACTIVO'], default: 'BORRADOR' },
  fechaPublicacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
}, {
  collection: 'noticias',
  timestamps: false
});

// Índices según Script 02 de la Guía de MongoDB
noticiaSchema.index({ estado: 1, fechaPublicacion: -1 });
noticiaSchema.index({ titulo: 'text', resumen: 'text', contenido: 'text' });

module.exports = mongoose.model('Noticia', noticiaSchema);
