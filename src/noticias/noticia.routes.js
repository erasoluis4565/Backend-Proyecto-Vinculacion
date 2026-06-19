const { Router } = require('express');
const noticiaController = require('./noticia.controller');
const { validateNoticia } = require('./noticia.validation');
const router = Router();

// GET /api/noticias
router.get('/', noticiaController.obtenerTodas);

// GET /api/noticias/:slug
router.get('/:slug', noticiaController.obtenerPorSlug);

// POST /api/noticias
// TODO: cuando exista el módulo auth (Integrante 7),
//       anteponer verificarToken y verificarRol(['ADMIN','EDITOR'])
router.post('/', validateNoticia, noticiaController.crear);

// PUT /api/noticias/:id
router.put('/:id', validateNoticia, noticiaController.actualizar);

// DELETE /api/noticias/:id  (baja lógica)
router.delete('/:id', noticiaController.eliminar);

module.exports = router;
