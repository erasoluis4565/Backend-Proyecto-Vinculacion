const Notificacion =
require("./notificacion.model");

const Suscriptor =
require("../suscriptores/suscriptor.model");

const emailService =
require("../../services/email.service");

// =========================================
// CONSULTAS
// =========================================

const obtenerTodas = async () => {

    return await Notificacion.find()
        .sort({
            fechaCreacion: -1
        });

};

// =========================================
// CREAR NOTIFICACIÓN
// =========================================

const crear = async (data) => {

    return await Notificacion.create(data);

};

// =========================================
// NOTIFICAR NUEVA PLANTA
// =========================================

const notificarNuevaPlanta = async (
    planta
) => {

    const suscriptores =
        await Suscriptor.find({

            estado: "ACTIVO",

            aceptaNotificaciones: true

        });

    let enviados = 0;

    for (const suscriptor of suscriptores) {

        try {

            await emailService
                .enviarCorreoNuevaPlanta(

                    suscriptor.nombre,

                    suscriptor.correo,

                    planta

                );

            enviados++;

        }

        catch (error) {

            console.error(

                `Error enviando correo a ${suscriptor.correo}`,

                error.message

            );

        }

    }

    await crear({

        tipo: "NUEVA_PLANTA",

        titulo:
            `Nueva planta medicinal: ${planta.nombreComun}`,

        mensaje:
            `Se notificó a los suscriptores sobre la nueva planta ${planta.nombreComun}.`,

        plantaSlug:
            planta.slug,

        canales: [

            "EMAIL"

        ],

        totalDestinatarios:
            enviados,

        estado:
            enviados > 0

                ? "ENVIADA"

                : "FALLIDA",

        fechaEnvio:
            new Date()

    });

    return {

        enviados,

        total:
            suscriptores.length

    };

};

module.exports = {

    obtenerTodas,

    crear,

    notificarNuevaPlanta

};