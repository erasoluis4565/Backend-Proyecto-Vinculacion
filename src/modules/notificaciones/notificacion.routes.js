const router =
require("express").Router();

const controller =
require("./notificacion.controller");

router.get(
    "/",
    controller.listar
);

router.post(
    "/",
    controller.crear
);

module.exports = router;