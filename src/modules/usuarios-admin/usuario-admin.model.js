const mongoose = require("mongoose");

const usuarioAdminSchema = new mongoose.Schema({

    correo: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    nombreCompleto: {
        type: String,
        required: true
    },

    rol: {
        type: String,
        enum: [
            "SUPER_ADMIN",
            "EDITOR",
            "CONSULTOR"
        ],
        default: "CONSULTOR"
    },

    estado: {
        type: String,
        enum: [
            "ACTIVO",
            "INACTIVO"
        ],
        default: "ACTIVO"
    },

    ultimoAcceso: {
        type: Date,
        default: null
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "UsuarioAdmin",
    usuarioAdminSchema,
    "usuarios_admin"
);