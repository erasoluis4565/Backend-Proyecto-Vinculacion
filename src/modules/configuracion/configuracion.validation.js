const { body } = require("express-validator");

const actualizarConfiguracionValidation = [

    body("proyecto")
        .notEmpty()
        .withMessage("El proyecto es obligatorio"),

    body("baseDatos")
        .notEmpty()
        .withMessage("La base de datos es obligatoria"),

    body("almacenamientoMultimedia")
        .optional()
        .isIn(["Cloudinary"])
        .withMessage(
            "Almacenamiento multimedia inválido"
        )

];

module.exports = {
    actualizarConfiguracionValidation
};