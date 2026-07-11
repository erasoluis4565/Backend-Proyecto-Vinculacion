const mongoose = require("mongoose");

const notificacionSchema = new mongoose.Schema({

    tipo: {
        type: String,
        enum: [
            "NUEVA_NOTICIA",
            "NUEVA_PLANTA",
            "NUEVO_MULTIMEDIA",
            "GENERAL"
        ],
        required: true
    },

    titulo: {
        type: String,
        required: true
    },

    mensaje: {
        type: String,
        required: true
    },

    noticiaSlug: {
        type: String,
        default: null
    },

    plantaSlug: {
        type: String,
        default: null
    },

    canales: [{
        type: String,
        enum: [
            "WEB",
            "EMAIL"
        ]
    }],

    totalDestinatarios: {
        type: Number,
        default: null
    },

    estado: {
        type: String,
        enum: [
            "PENDIENTE",
            "ENVIADA",
            "FALLIDA"
        ],
        default: "PENDIENTE"
    },

    fechaCreacion: {
        type: Date,
        default: Date.now
    },

    fechaEnvio: {
        type: Date,
        default: null
    }

});

module.exports = mongoose.model(
    "Notificacion",
    notificacionSchema
);