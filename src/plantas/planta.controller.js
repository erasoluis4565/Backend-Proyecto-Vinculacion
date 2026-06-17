const plantaService = require('./planta.service');

class PlantaController {

  async obtenerTodas(req, res) {
    try {
      const plantas = await plantaService.obtenerTodas(req.query);
      res.status(200).json({ ok: true, total: plantas.length, data: plantas });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al obtener plantas', error: error.message });
    }
  }

  async obtenerPorSlug(req, res) {
    try {
      const planta = await plantaService.obtenerPorSlug(req.params.slug);
      if (!planta) return res.status(404).json({ ok: false, msg: 'Planta no encontrada' });
      res.status(200).json({ ok: true, data: planta });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al obtener la planta', error: error.message });
    }
  }

  async crear(req, res) {
    try {
      const planta = await plantaService.crear(req.body);
      res.status(201).json({ ok: true, msg: 'Planta creada correctamente', data: planta });
    } catch (error) {
      const status = error.statusCode || 500;
      res.status(status).json({ ok: false, msg: error.message });
    }
  }

  async actualizar(req, res) {
    try {
      const planta = await plantaService.actualizar(req.params.id, req.body);
      if (!planta) return res.status(404).json({ ok: false, msg: 'Planta no encontrada' });
      res.status(200).json({ ok: true, msg: 'Planta actualizada', data: planta });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al actualizar', error: error.message });
    }
  }

  async eliminar(req, res) {
    try {
      const planta = await plantaService.eliminar(req.params.id);
      if (!planta) return res.status(404).json({ ok: false, msg: 'Planta no encontrada' });
      res.status(200).json({ ok: true, msg: 'Planta eliminada (lógico)', data: planta });
    } catch (error) {
      res.status(500).json({ ok: false, msg: 'Error al eliminar', error: error.message });
    }
  }
}

module.exports = new PlantaController();