const auditoriaService =
require("./auditoria.service");

const listar = async (req,res)=>{

    const resultado =
    await auditoriaService
    .obtenerTodas();

    res.status(200)
    .json(resultado);

};

const crear = async (req,res)=>{

    const resultado =
    await auditoriaService
    .crear(req.body);

    res.status(201)
    .json(resultado);

};

module.exports = {
    listar,
    crear
};