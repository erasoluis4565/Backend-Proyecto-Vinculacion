const notificacionService =
require("./notificacion.service");

const listar = async (req,res)=>{

    const resultado =
    await notificacionService
    .obtenerTodas();

    res.status(200).json(resultado);

};

const crear = async (req,res)=>{

    const resultado =
    await notificacionService
    .crear(req.body);

    res.status(201).json(resultado);

};

module.exports = {
    listar,
    crear
};