const { body } = require("express-validator");

const crearSuscriptorValidation = [

    body("correo")
        .notEmpty()
        .withMessage("El correo es obligatorio")
        .isEmail()
        .withMessage("Correo inválido")

];

const actualizarSuscriptorValidation = [

    body("estado")

        .optional()

        .isIn([
            "ACTIVO",
            "INACTIVO",
            "PENDIENTE"
        ])

        .withMessage(
            "Estado inválido"
        ),

    body("intereses")

        .optional()

        .isArray()

        .withMessage(
            "Los intereses deben ser un arreglo"
        )

];

const cancelarSuscripcionValidation = [

    body("correo")

        .notEmpty()

        .withMessage(
            "El correo es obligatorio"
        )

        .isEmail()

        .withMessage(
            "Correo inválido"
        )

];


module.exports = {
    crearSuscriptorValidation,
    actualizarSuscriptorValidation,
    cancelarSuscripcionValidation
};

