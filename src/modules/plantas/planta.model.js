const mongoose = require('mongoose');

const taxonomiaSchema = new mongoose.Schema({
  reino: { type: String, required: true },
  division: { type: String, required: true },
  clase: { type: String, required: true },
  familia: { type: String, required: true },
  genero: { type: String, required: true }
}, { _id: false });

const etnobotanicaSchema = new mongoose.Schema({
  clasificacion: { type: String },
  parteUtilizada: { type: String },
  usoTradicional: { type: String },
  compuestosQuimicos: [{ type: String }]
}, { _id: false });

const analisisAcademicoSchema = new mongoose.Schema({
  taxonomia: { type: String },
  etnobotanica: { type: String },
  fitoquimica: { type: String },
  sostenibilidad: { type: String }
}, { _id: false });

const multimediaPrincipalSchema = new mongoose.Schema({
  imagenUrl: { type: String, default: '' },
  imagenPublicId: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  videoPublicId: { type: String, default: '' },
  proveedor: { type: String, enum: ['CLOUDINARY', 'NINGUNO'], default: 'NINGUNO' }
}, { _id: false });

const plantaSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  nombreComun: { type: String, required: true, trim: true },
  nombreCientifico: { type: String, required: true, unique: true, trim: true },
  nombresAlternativos: [{ type: String, trim: true }],
  taxonomia: { type: taxonomiaSchema, required: true },
  etnobotanica: { type: etnobotanicaSchema, default: {} },
  analisisAcademico: { type: analisisAcademicoSchema, default: {} },
  multimediaPrincipal: { type: multimediaPrincipalSchema, default: { proveedor: 'NINGUNO' } },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  fechaRegistro: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
}, {
  collection: 'plantas',
  timestamps: false
});

// Índices según Script 02
plantaSchema.index({ slug: 1 }, { unique: true });
plantaSchema.index({ nombreCientifico: 1 }, { unique: true });
plantaSchema.index({ nombreComun: 1 });
plantaSchema.index({ 'taxonomia.familia': 1 });
plantaSchema.index({ 'etnobotanica.clasificacion': 1 });
plantaSchema.index({ estado: 1 });
plantaSchema.index({ 
  nombreComun: 'text', 
  nombreCientifico: 'text', 
  'etnobotanica.usoTradicional': 'text', 
  'etnobotanica.compuestosQuimicos': 'text' 
});

module.exports = mongoose.model('Planta', plantaSchema);