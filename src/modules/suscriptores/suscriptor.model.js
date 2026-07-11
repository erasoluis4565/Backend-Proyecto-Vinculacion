const mongoose = require("mongoose");

const suscriptorSchema = new mongoose.Schema({

    nombre: {
        type: String
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    intereses: [{
        type: String
    }],

    aceptaNotificaciones: {
        type: Boolean,
        default: true
    },
    
    aceptaTerminos: {
        type: Boolean,
        required: true,
        default: false
    },

    fechaAceptacionTerminos: {
        type: Date,
        default: null
    },

    versionTerminos: {
        type: String,
        default: "1.0"
    },
    
    estado: {
        type: String,
        enum: [
            "ACTIVO",
            "INACTIVO",
            "PENDIENTE"
        ],
        default: "PENDIENTE"
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    },

    ultimaNotificacion: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model(
    "Suscriptor",
    suscriptorSchema
);