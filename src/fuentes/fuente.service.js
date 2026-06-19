const Fuente = require('./fuente.model');

const obtenerTodas = async () => {
  return await Fuente.find({ estado: 'ACTIVO' });
};

const crear = async (datosFuente) => {
  const nuevaFuente = new Fuente(datosFuente);
  return await nuevaFuente.save();
};

const actualizar = async (id, datosFuente) => {
  datosFuente.fechaActualizacion = Date.now();
  return await Fuente.findByIdAndUpdate(id, datosFuente, { new: true });
};

module.exports = {
  obtenerTodas,
  crear,
  actualizar
};
