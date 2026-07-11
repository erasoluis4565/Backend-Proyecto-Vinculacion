const Auditoria =
require(
    "../modules/auditoria/auditoria.model"
);

const registrar = async (

    accion,

    coleccion,

    usuarioCorreo,

    detalle,

    documentoSlug = null

) => {

    try {

        await Auditoria.create({

            accion,

            coleccion,

            usuarioCorreo,

            detalle,

            documentoSlug

        });

    } catch (error) {

        console.error(
            "Error registrando auditoría"
        );

    }

};

module.exports = {
    registrar
};