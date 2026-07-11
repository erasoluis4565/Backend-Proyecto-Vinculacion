const Suscriptor = require("./suscriptor.model");
const emailService =
    require("../../services/email.service");


const obtenerTodos = async () => {

    return await Suscriptor.find();

};

const crear = async (data) => {

    const existente =
        await Suscriptor.findOne({

            correo: data.correo

        });

    if (existente) {

        const error = new Error(
            "Este correo ya se encuentra suscrito."
        );

        error.status = 409;

        throw error;

    }

    // Se crea inicialmente como PENDIENTE
    // Se crea inicialmente como PENDIENTE
    const suscriptor =
    await Suscriptor.create({

        ...data,

        aceptaTerminos: data.aceptaTerminos,

        fechaAceptacionTerminos: new Date(),

        versionTerminos: "1.0"

    });

    try {

        // Se envía el correo de bienvenida
        await emailService.enviarCorreoBienvenida(

            suscriptor.nombre,

            suscriptor.correo

        );

        // Si el correo fue enviado correctamente,
        // la suscripción pasa a ACTIVA
        suscriptor.estado = "ACTIVO";

        suscriptor.ultimaNotificacion = new Date();

        await suscriptor.save();

    }

    catch (error) {

        console.error(

            "Error enviando correo de bienvenida:",

            error.message

        );

    }

    return suscriptor;

};

const actualizar = async (
    id,
    data
) => {

    return await Suscriptor.findByIdAndUpdate(

        id,

        data,

        {
            new: true
        }

    );

};

const cancelarPorCorreo = async (correo) => {

    return await Suscriptor.findOneAndUpdate(

        { correo },

        {
            estado: "INACTIVO",
            aceptaNotificaciones: false
        },

        {
            new: true
        }

    );

};

const reactivarPorCorreo = async (correo) => {

    return await Suscriptor.findOneAndUpdate(

        { correo },

        {
            estado: "ACTIVO",
            aceptaNotificaciones: true
        },

        {
            new: true
        }

    );

};

module.exports = {

    obtenerTodos,

    crear,

    actualizar,

    cancelarPorCorreo,

    reactivarPorCorreo

};