const router =
require("express").Router();

const controller =
require("./multimedia.controller");

const {
    crearMultimediaValidation
} = require(
    "./multimedia.validation"
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
    controller.listar
);

router.get(
    "/:id",
    controller.obtener
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "EDITOR"
    ),
    crearMultimediaValidation,
    validarCampos,
    controller.crear
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "EDITOR"
    ),
    controller.actualizar
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "SUPER_ADMIN",
        "EDITOR"
    ),
    controller.eliminar
);

module.exports = router;