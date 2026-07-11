const { body } = require("express-validator");

const loginValidation = [

    body("correo")
        .notEmpty()
        .withMessage("El correo es obligatorio")
        .isEmail()
        .withMessage("Correo inválido"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")

];

module.exports = {
    loginValidation
};