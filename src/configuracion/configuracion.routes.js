const { Router } = require('express');
const configuracionController = require('./configuracion.controller');
const { validateConfiguracion } = require('./configuracion.validation');
const router = Router();

// GET /api/configuracion
router.get('/', configuracionController.obtener);

// PUT /api/configuracion
router.put('/', validateConfiguracion, configuracionController.actualizar);

module.exports = router;
