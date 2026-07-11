const { body } = require("express-validator");

const crearMultimediaValidation = [

    body("titulo")
        .notEmpty()
        .withMessage("El título es obligatorio"),

    body("tipo")
        .notEmpty()
        .withMessage("El tipo es obligatorio")
        .isIn([
            "IMAGEN",
            "VIDEO",
            "DOCUMENTO"
        ])
        .withMessage("Tipo inválido"),

    body("url")
        .notEmpty()
        .withMessage("La URL es obligatoria"),

    body("publicId")
        .notEmpty()
        .withMessage("El publicId es obligatorio")

];

module.exports = {
    crearMultimediaValidation
};