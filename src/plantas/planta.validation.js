const Joi = require('joi');

const taxonomiaJoi = Joi.object({
  reino: Joi.string().required(),
  division: Joi.string().required(),
  clase: Joi.string().required(),
  familia: Joi.string().required(),
  genero: Joi.string().required()
});

const etnobotanicaJoi = Joi.object({
  clasificacion: Joi.string().allow('', null),
  parteUtilizada: Joi.string().allow('', null),
  usoTradicional: Joi.string().allow('', null),
  compuestosQuimicos: Joi.array().items(Joi.string()).default([])
});

const crearPlantaSchema = Joi.object({
  slug: Joi.string().lowercase().trim().required(),
  nombreComun: Joi.string().trim().required(),
  nombreCientifico: Joi.string().trim().required(),
  nombresAlternativos: Joi.array().items(Joi.string()).default([]),
  taxonomia: taxonomiaJoi.required(),
  etnobotanica: etnobotanicaJoi.default({}),
  analisisAcademico: Joi.object().default({}),
  multimediaPrincipal: Joi.object().default({ proveedor: 'NINGUNO' }),
  estado: Joi.string().valid('ACTIVO', 'INACTIVO').default('ACTIVO')
});

const actualizarPlantaSchema = Joi.object({
  nombreComun: Joi.string().trim(),
  nombreCientifico: Joi.string().trim(),
  nombresAlternativos: Joi.array().items(Joi.string()),
  taxonomia: taxonomiaJoi,
  etnobotanica: etnobotanicaJoi,
  analisisAcademico: Joi.object(),
  multimediaPrincipal: Joi.object(),
  estado: Joi.string().valid('ACTIVO', 'INACTIVO')
}).min(1);

module.exports = { crearPlantaSchema, actualizarPlantaSchema };