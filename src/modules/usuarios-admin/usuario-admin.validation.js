const { body } = require("express-validator");

const crearUsuarioAdminValidation = [

    body("correo")
        .notEmpty()
        .withMessage("El correo es obligatorio")
        .isEmail()
        .withMessage("Correo inválido"),

    body("passwordHash")
        .notEmpty()
        .withMessage("La contraseña es obligatoria"),

    body("nombreCompleto")
        .notEmpty()
        .withMessage("El nombre es obligatorio"),

    body("rol")
        .optional()
        .isIn([
            "SUPER_ADMIN",
            "EDITOR",
            "CONSULTOR"
        ])
        .withMessage("Rol inválido")

];

module.exports = {
    crearUsuarioAdminValidation
};