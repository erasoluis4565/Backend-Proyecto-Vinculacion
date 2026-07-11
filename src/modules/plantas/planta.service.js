const Planta = require("./planta.model");

const auditoriaService =
require(
    "../../services/auditoria.service"
);

const notificacionService =
require(
    "../notificaciones/notificacion.service"
);

// =========================================
// OBTENER TODAS LAS PLANTAS
// =========================================

const obtenerTodas = async (filtros = {}) => {

    const query = {
        estado: "ACTIVO"
    };

    if (filtros.familia) {

        query["taxonomia.familia"] =
            filtros.familia;

    }

    return await Planta.find(query)
        .select(
            "slug nombreComun nombreCientifico taxonomia.familia multimediaPrincipal.imagenUrl"
        )
        .sort({
            nombreComun: 1
        });

};

// =========================================
// OBTENER PLANTA POR SLUG
// =========================================

const obtenerPorSlug = async (slug) => {

    return await Planta.findOne({

        slug,

        estado: "ACTIVO"

    });

};

// =========================================
// CREAR PLANTA
// =========================================

const crear = async (data) => {

    const planta =
        await Planta.create({

            ...data,

            fechaRegistro:
                new Date(),

            fechaActualizacion:
                new Date()

        });

    // Registrar auditoría

    await auditoriaService.registrar(

        "INSERT",

        "plantas",

        "SISTEMA",

        `Creó la planta: ${planta.nombreComun}`,

        planta.slug

    );

    // Enviar notificación por correo
    // a los suscriptores

    try {

        await notificacionService
            .notificarNuevaPlanta(
                planta
            );

    }

    catch (error) {

        console.error(

            "Error enviando notificaciones:",

            error.message

        );

    }

    return planta;

};

// =========================================
// ACTUALIZAR PLANTA
// =========================================

const actualizar = async (
    id,
    data
) => {

    const planta =
        await Planta.findByIdAndUpdate(

            id,

            {

                ...data,

                fechaActualizacion:
                    new Date()

            },

            {

                new: true,

                runValidators: true

            }

        );

    if (planta) {

        await auditoriaService.registrar(

            "UPDATE",

            "plantas",

            "SISTEMA",

            `Actualizó la planta: ${planta.nombreComun}`,

            planta.slug

        );

    }

    return planta;

};

// =========================================
// ELIMINAR (INACTIVAR) PLANTA
// =========================================

const eliminar = async (id) => {

    const planta =
        await Planta.findByIdAndUpdate(

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

    if (planta) {

        await auditoriaService.registrar(

            "DELETE",

            "plantas",

            "SISTEMA",

            `Desactivó la planta: ${planta.nombreComun}`,

            planta.slug

        );

    }

    return planta;

};

// =========================================
// EXPORTAR
// =========================================

module.exports = {

    obtenerTodas,

    obtenerPorSlug,

    crear,

    actualizar,

    eliminar

};