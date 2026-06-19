const { Router } = require('express');
const fuenteController = require('./fuente.controller');
const { validateFuente } = require('./fuente.validation');
const router = Router();

// GET /api/fuentes
router.get('/', fuenteController.obtenerTodas);

// POST /api/fuentes
router.post('/', validateFuente, fuenteController.crear);

// PUT /api/fuentes/:id
router.put('/:id', validateFuente, fuenteController.actualizar);

module.exports = router;
