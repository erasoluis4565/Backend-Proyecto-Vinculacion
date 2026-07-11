const router =
require("express").Router();

const controller =
require("./planta.controller");

const {
    crearPlantaValidation
} = require("./planta.validation");

const validarCampos =
require("../../middlewares/validation.middleware");

const authMiddleware =
require("../../middlewares/auth.middleware");

const roleMiddleware =
require("../../middlewares/role.middleware");

router.get(
    "/",
    controller.listar
);

router.get(
    "/:slug",
    controller.obtener
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
    "SUPER_ADMIN",
    "EDITOR"
    ),
    crearPlantaValidation,
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