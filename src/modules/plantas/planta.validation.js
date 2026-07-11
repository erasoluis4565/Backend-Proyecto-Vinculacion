const { body } = require("express-validator");

const crearPlantaValidation = [

    body("slug")
        .notEmpty()
        .withMessage("El slug es obligatorio"),

    body("nombreComun")
        .notEmpty()
        .withMessage("El nombre común es obligatorio"),

    body("nombreCientifico")
        .notEmpty()
        .withMessage("El nombre científico es obligatorio")

];

module.exports = {
    crearPlantaValidation
};