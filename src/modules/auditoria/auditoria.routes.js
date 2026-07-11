const router = require("express").Router();

const controller = require("./auditoria.controller");

const {
    crearAuditoriaValidation
} = require("./auditoria.validation");

const validarCampos = require("../../middlewares/validation.middleware");

const authMiddleware = require("../../middlewares/auth.middleware");

const roleMiddleware = require("../../middlewares/role.middleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    controller.listar
);

router.post(
    "/",
    crearAuditoriaValidation,
    validarCampos,
    controller.crear
);

module.exports = router;
