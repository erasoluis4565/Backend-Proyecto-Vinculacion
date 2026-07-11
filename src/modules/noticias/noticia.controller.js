const noticiaService =
require("./noticia.service");

const listar = async (req, res) => {

    const resultado =
    await noticiaService.obtenerTodos();

    res.status(200).json(resultado);

};

const obtener = async (req, res) => {

    const resultado =
    await noticiaService.obtenerPorId(
        req.params.id
    );

    if (!resultado) {

        return res.status(404).json({
            mensaje:
            "Noticia no encontrada"
        });

    }

    res.status(200).json(resultado);

};

const crear = async (req, res) => {

    const resultado =
    await noticiaService.crear(
        req.body
    );

    res.status(201).json(resultado);

};

const actualizar = async (req, res) => {

    const resultado =
    await noticiaService.actualizar(
        req.params.id,
        req.body
    );

    res.status(200).json(resultado);

};

const eliminar = async (req, res) => {

    const resultado =
    await noticiaService.eliminar(
        req.params.id
    );

    res.status(200).json(resultado);

};

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar
};