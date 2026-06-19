const configuracionService = require('./configuracion.service');

const obtener = async (req, res) => {
  try {
    const configuracion = await configuracionService.obtener();
    res.status(200).json(configuracion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la configuración', error: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const configuracionActualizada = await configuracionService.actualizar(req.body);
    res.status(200).json(configuracionActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la configuración', error: error.message });
  }
};

module.exports = {
  obtener,
  actualizar
};
