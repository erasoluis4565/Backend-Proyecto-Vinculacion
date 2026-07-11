const router =
require("express").Router();

const controller =
require("./auth.controller");

const {
    loginValidation
} = require(
    "./auth.validation"
);

const validarCampos =
require(
    "../../middlewares/validation.middleware"
);

router.post(

    "/login",

    loginValidation,

    validarCampos,

    controller.login

);

module.exports = router;