const fuenteService =
require("./fuente.service");

const listar = async (req,res)=>{

    const resultado =
    await fuenteService
    .obtenerTodas();

    res.status(200)
    .json(resultado);

};

const crear = async (req,res)=>{

    const resultado =
    await fuenteService
    .crear(req.body);

    res.status(201)
    .json(resultado);

};

module.exports = {
    listar,
    crear
};