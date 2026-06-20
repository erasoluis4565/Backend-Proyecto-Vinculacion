const { body, validationResult } = require('express-validator');

// Middleware que corta la petición si hubo errores de validación
const manejarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Datos inválidos',
      errores: errores.array()
    });
  }
  next();
};

// Validación usada en POST y PUT (mismo estilo que validateFuente)
const validateNoticia = [
  body('titulo').trim().notEmpty().withMessage('El título es obligatorio'),
  body('resumen').trim().notEmpty().withMessage('El resumen es obligatorio'),
  body('contenido').trim().notEmpty().withMessage('El contenido es obligatorio'),
  body('slug').optional().trim(),
  body('categoria').optional().trim(),
  body('autorCorreo').optional().trim().isEmail().withMessage('autorCorreo debe ser un correo válido'),
  body('estado').optional().isIn(['BORRADOR', 'PUBLICADO', 'INACTIVO']).withMessage('Estado no válido'),
  body('portada').optional().isObject().withMessage('portada debe ser un objeto'),
  body('multimediaIds').optional().isArray().withMessage('multimediaIds debe ser un arreglo'),
  manejarErrores
];

module.exports = { validateNoticia };
