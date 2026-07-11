const router =
require("express").Router();

const controller =
require("./usuario-admin.controller");

const {
    crearUsuarioAdminValidation
} = require(
    "./usuario-admin.validation"
);

const validarCampos =
require(
    "../../middlewares/validation.middleware"
);

const authMiddleware =
require("../../middlewares/auth.middleware");

const roleMiddleware =
require("../../middlewares/role.middleware");

router.get(
    "/",
    authMiddleware,
    controller.listar
);

router.get(
    "/:id",
    authMiddleware,
    controller.obtener
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN"
    ),
    crearUsuarioAdminValidation,
    validarCampos,
    controller.crear
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN"
    ),
    controller.actualizar
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN"
    ),
    controller.eliminar
);

module.exports = router;