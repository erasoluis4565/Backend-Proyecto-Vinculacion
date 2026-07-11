const router = require("express").Router();

const controller = require("./configuracion.controller");

const {
    actualizarConfiguracionValidation
} = require("./configuracion.validation");

const validarCampos = require("../../middlewares/validation.middleware");

const authMiddleware = require("../../middlewares/auth.middleware");

const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
    "/",
    controller.obtener
);

router.put(
    "/",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    actualizarConfiguracionValidation,
    validarCampos,
    controller.actualizar
);

module.exports = router;
