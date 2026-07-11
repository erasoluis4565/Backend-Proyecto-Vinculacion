const plantaService =
require("./planta.service");

const listar = async (req,res)=>{

    const resultado =
    await plantaService
    .obtenerTodas(req.query);

    res.status(200)
    .json(resultado);

};

const obtener = async (req,res)=>{

    const resultado =
    await plantaService
    .obtenerPorSlug(
        req.params.slug
    );

    if(!resultado){
        return res.status(404)
        .json({
            mensaje:
            "Planta no encontrada"
        });
    }

    res.status(200)
    .json(resultado);

};

const crear = async (req,res)=>{

    const resultado =
    await plantaService
    .crear(req.body);

    res.status(201)
    .json(resultado);

};

const actualizar = async (req,res)=>{

    const resultado =
    await plantaService
    .actualizar(
        req.params.id,
        req.body
    );

    res.status(200)
    .json(resultado);

};

const eliminar = async (req,res)=>{

    const resultado =
    await plantaService
    .eliminar(
        req.params.id
    );

    res.status(200)
    .json(resultado);

};

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar
};