const {
    body
} = require("express-validator");

const crearNoticiaValidation = [

    body("slug")
        .notEmpty()
        .withMessage(
            "El slug es obligatorio"
        ),

    body("titulo")
        .notEmpty()
        .withMessage(
            "El título es obligatorio"
        ),

    body("resumen")
        .notEmpty()
        .withMessage(
            "El resumen es obligatorio"
        ),

    body("contenido")
        .notEmpty()
        .withMessage(
            "El contenido es obligatorio"
        ),

    body("fechaPublicacion")
        .notEmpty()
        .withMessage(
            "La fecha de publicación es obligatoria"
        )

];

module.exports = {
    crearNoticiaValidation
};