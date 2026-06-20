const noticiaService = require('./noticia.service');

class NoticiaController {

  async obtenerTodas(req, res) {
    try {
      const noticias = await noticiaService.obtenerTodas(req.query);
      res.status(200).json({ ok: true, total: noticias.length, data: noticias });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al obtener noticias', error: error.message });
    }
  }

  async obtenerPorSlug(req, res) {
    try {
      const noticia = await noticiaService.obtenerPorSlug(req.params.slug);
      if (!noticia) return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
      res.status(200).json({ ok: true, data: noticia });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al obtener la noticia', error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const noticia = await noticiaService.crear(req.body);
      res.status(201).json({ ok: true, msg: 'Noticia creada correctamente', data: noticia });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ ok: false, msg: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const noticia = await noticiaService.actualizar(req.params.id, req.body);
      if (!noticia) return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
      res.status(200).json({ ok: true, msg: 'Noticia actualizada', data: noticia });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al actualizar', error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const noticia = await noticiaService.eliminar(req.params.id);
      if (!noticia) return res.status(404).json({ ok: false, msg: 'Noticia no encontrada' });
      res.status(200).json({ ok: true, msg: 'Noticia eliminada (lógico)', data: noticia });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al eliminar', error: error.message });
    }
  }
}

module.exports = new NoticiaController();
