const Noticia =
require("./noticia.model");

const auditoriaService =
require(
    "../../services/auditoria.service"
);

const obtenerTodos = async () => {

    return await Noticia.find();

};

const obtenerPorId = async (id) => {

    return await Noticia.findById(id);

};

const crear = async (data) => {

    const noticia =
    await Noticia.create(data);

    await auditoriaService.registrar(

        "INSERT",

        "noticias",

        "SISTEMA",

        `Creó la noticia: ${noticia.titulo}`,

        noticia.slug

    );

    return noticia;

};

const actualizar = async (id, data) => {

    const noticia =
    await Noticia.findByIdAndUpdate(

        id,

        {
            ...data,
            fechaActualizacion:
            new Date()
        },

        {
            new: true
        }

    );

    if (noticia) {

        await auditoriaService.registrar(

            "UPDATE",

            "noticias",

            "SISTEMA",

            `Actualizó la noticia: ${noticia.titulo}`,

            noticia.slug

        );

    }

    return noticia;

};

const eliminar = async (id) => {

    const noticia =
    await Noticia.findByIdAndUpdate(

        id,

        {
            estado: "INACTIVO",
            fechaActualizacion:
            new Date()
        },

        {
            new: true
        }

    );

    if (noticia) {

        await auditoriaService.registrar(

            "DELETE",

            "noticias",

            "SISTEMA",

            `Desactivó la noticia: ${noticia.titulo}`,

            noticia.slug

        );

    }

    return noticia;

};

module.exports = {
    obtenerTodos,
    obtenerPorId,
    crear,
    actualizar,
    eliminar
};