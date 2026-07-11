const suscriptorService =
    require("./suscriptor.service");

const listar = async (req, res) => {

    const resultado =
        await suscriptorService.obtenerTodos();

    res.status(200).json(resultado);

};

const crear = async (req, res, next) => {

    try {

        if (!req.body.aceptaTerminos) {

            return res.status(400).json({

                success: false,

                message:
                    "Debe aceptar los términos y condiciones."

            });

        }

        const resultado =
            await suscriptorService.crear(req.body);

        return res
            .status(201)
            .json({

                success: true,

                message:
                    "Suscripción realizada correctamente.",

                data: resultado

            });

    }

    catch (error) {

        if (
            error.message ===
            "Este correo ya se encuentra suscrito."
        ) {

            return res
                .status(409)
                .json({

                    success: false,

                    message:
                        error.message

                });

        }

        next(error);

    }

};

const actualizar = async (
    req,
    res
) => {

    const resultado =
        await suscriptorService
            .actualizar(

                req.params.id,

                req.body

            );

    res.status(200)
        .json(resultado);

};

const cancelarPorCorreo = async (
    req,
    res
) => {

    const resultado =
        await suscriptorService
            .cancelarPorCorreo(
                req.body.correo
            );

    if (!resultado) {

        return res
            .status(404)
            .json({
                message:
                    "Suscriptor no encontrado"
            });

    }

    res.status(200)
        .json({

            message:
                "Suscripción cancelada correctamente",

            suscriptor:
                resultado

        });

};

const reactivarPorCorreo = async (
    req,
    res
) => {

    const resultado =
        await suscriptorService
            .reactivarPorCorreo(
                req.body.correo
            );

    if (!resultado) {

        return res
            .status(404)
            .json({
                message:
                    "Suscriptor no encontrado"
            });

    }

    res.status(200)
        .json({

            message:
                "Suscripción reactivada correctamente",

            suscriptor:
                resultado

        });

};

module.exports = {

    listar,

    crear,

    actualizar,

    cancelarPorCorreo,

    reactivarPorCorreo

};