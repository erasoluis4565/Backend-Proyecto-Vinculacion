const { body, validationResult } = require('express-validator');

const validateConfiguracion = [
  body('nombreVivero').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateConfiguracion
};
