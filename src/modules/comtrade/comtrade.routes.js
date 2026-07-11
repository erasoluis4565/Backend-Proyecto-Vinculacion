const router =
require("express").Router();

const controller =
require("./comtrade.controller");

router.get(

    "/catalogo",

    controller.catalogo

);

router.get(

    "/:plantaSlug",

    controller.obtenerPlanta

);

router.get(

    "/consulta/:plantaSlug",

    controller.consultar

);

module.exports = router;