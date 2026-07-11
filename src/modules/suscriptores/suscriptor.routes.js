const router =
require("express").Router();

const controller =
require("./suscriptor.controller");

const {
    crearSuscriptorValidation,
    actualizarSuscriptorValidation,
    cancelarSuscripcionValidation
} = require(
    "./suscriptor.validation"
);

const validarCampos =
require(
    "../../middlewares/validation.middleware"
);

router.get(
    "/",
    controller.listar
);

router.post(
    "/",
    crearSuscriptorValidation,
    validarCampos,
    controller.crear
);

router.put(

    "/cancelar",

    cancelarSuscripcionValidation,

    validarCampos,

    controller.cancelarPorCorreo

);

router.put(

    "/reactivar",

    cancelarSuscripcionValidation,

    validarCampos,

    controller.reactivarPorCorreo

);

router.put(

    "/:id",

    actualizarSuscriptorValidation,

    validarCampos,

    controller.actualizar

);

module.exports = router;