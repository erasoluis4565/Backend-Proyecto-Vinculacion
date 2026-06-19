const fuenteService = require('./fuente.service');

const obtenerTodas = async (req, res) => {
  try {
    const fuentes = await fuenteService.obtenerTodas();
    res.status(200).json(fuentes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las fuentes', error: error.message });
  }
};

const crear = async (req, res) => {
  try {
    const nuevaFuente = await fuenteService.crear(req.body);
    res.status(201).json(nuevaFuente);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la fuente', error: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const fuenteActualizada = await fuenteService.actualizar(req.params.id, req.body);
    if (!fuenteActualizada) {
      return res.status(404).json({ message: 'Fuente no encontrada' });
    }
    res.status(200).json(fuenteActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la fuente', error: error.message });
  }
};

module.exports = {
  obtenerTodas,
  crear,
  actualizar
};
