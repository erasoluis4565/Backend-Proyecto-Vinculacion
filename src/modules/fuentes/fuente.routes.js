const router =
require("express").Router();

const controller =
require("./fuente.controller");

const {
    crearFuenteValidation
} = require("./fuente.validation");

const validarCampos =
require("../../middlewares/validation.middleware");

router.get(
    "/",
    controller.listar
);

router.post(
    "/",
    crearFuenteValidation,
    validarCampos,
    controller.crear
);

module.exports = router;