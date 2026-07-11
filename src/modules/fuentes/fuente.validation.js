const { body } = require("express-validator");

const crearFuenteValidation = [

    body("titulo")
        .notEmpty()
        .withMessage("El título es obligatorio"),

    body("url")
        .notEmpty()
        .withMessage("La URL es obligatoria")

];

module.exports = {
    crearFuenteValidation
};