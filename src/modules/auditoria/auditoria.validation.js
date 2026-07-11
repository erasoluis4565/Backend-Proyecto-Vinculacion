const { body } = require("express-validator");

const crearAuditoriaValidation = [

    body("accion")
        .notEmpty()
        .withMessage("La acción es obligatoria"),

    body("usuario")
        .notEmpty()
        .withMessage("El usuario es obligatorio")

];

module.exports = {
    crearAuditoriaValidation
};