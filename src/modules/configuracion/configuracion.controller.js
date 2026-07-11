const configuracionService =
require("./configuracion.service");

const obtener = async (req,res)=>{

    const resultado =
    await configuracionService
    .obtenerConfiguracion();

    res.status(200)
    .json(resultado);

};

const actualizar = async (req,res)=>{

    const resultado =
    await configuracionService
    .actualizarConfiguracion(req.body);

    res.status(200)
    .json(resultado);

};

module.exports = {
    obtener,
    actualizar
};