const { Router } = require('express');
const plantaController = require('./planta.controller');
const router = Router();

// === RUTAS PÚBLICAS ===
// GET /api/plantas
router.get('/', plantaController.obtenerTodas);

// GET /api/plantas/:slug
router.get('/:slug', plantaController.obtenerPorSlug);

// === RUTAS PRIVADAS (ADMIN) ===
// POST /api/admin/plantas
router.post('/', plantaController.crear);

// PUT /api/admin/plantas/:id
router.put('/:id', plantaController.actualizar);

// DELETE /api/admin/plantas/:id
router.delete('/:id', plantaController.eliminar);

module.exports = router;