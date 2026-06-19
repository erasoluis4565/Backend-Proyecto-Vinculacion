const Configuracion = require('./configuracion.model');

const obtener = async () => {
  let configuracion = await Configuracion.findOne();
  if (!configuracion) {
    configuracion = await Configuracion.create({});
  }
  return configuracion;
};

const actualizar = async (datosConfiguracion) => {
  let configuracion = await Configuracion.findOne();
  if (!configuracion) {
    return await Configuracion.create(datosConfiguracion);
  }
  datosConfiguracion.fechaActualizacion = Date.now();
  return await Configuracion.findByIdAndUpdate(configuracion._id, datosConfiguracion, { new: true });
};

module.exports = {
  obtener,
  actualizar
};
