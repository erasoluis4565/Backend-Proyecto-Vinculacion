const multimediaService =
require("./multimedia.service");

const listar = async (req, res) => {

    const resultado =
    await multimediaService.obtenerTodos();

    res.status(200).json(resultado);

};

const obtener = async (req, res) => {

    const resultado =
    await multimediaService.obtenerPorId(
        req.params.id
    );

    if (!resultado) {

        return res.status(404).json({
            mensaje:
            "Registro no encontrado"
        });

    }

    res.status(200).json(resultado);

};

const crear = async (req, res) => {

    const resultado =
    await multimediaService.crear(
        req.body
    );

    res.status(201).json(resultado);

};

const actualizar = async (req, res) => {

    const resultado =
    await multimediaService.actualizar(
        req.params.id,
        req.body
    );

    res.status(200).json(resultado);

};

const eliminar = async (req, res) => {

    const resultado =
    await multimediaService.eliminar(
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