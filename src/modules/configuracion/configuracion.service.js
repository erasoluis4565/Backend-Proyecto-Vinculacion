const Configuracion =
require("./configuracion.model");

const auditoriaService =
require(
    "../../services/auditoria.service"
);

const obtenerConfiguracion =
async () => {

    return await Configuracion.findOne();

};

const actualizarConfiguracion =
async (data) => {

    const configuracion =
    await Configuracion.findOneAndUpdate(

        {},

        data,

        {
            new: true,
            upsert: true
        }

    );

    await auditoriaService.registrar(

        "UPDATE",

        "configuracion",

        "SISTEMA",

        "Actualizó la configuración general"

    );

    return configuracion;

};

module.exports = {
    obtenerConfiguracion,
    actualizarConfiguracion
};