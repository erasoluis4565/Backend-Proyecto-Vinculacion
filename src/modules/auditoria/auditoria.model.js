const mongoose = require("mongoose");

const auditoriaSchema = new mongoose.Schema({

    accion: {
        type: String,
        enum: [
            "INSERT",
            "UPDATE",
            "DELETE",
            "LOGIN",
            "UPLOAD",
            "PUBLICAR_NOTICIA",
            "OTRO"
        ],
        required: true
    },

    coleccion: {
        type: String,
        required: true
    },

    documentoSlug: {
        type: String,
        default: null
    },

    usuarioCorreo: {
        type: String,
        required: true
    },

    detalle: {
        type: String
    },

    fechaAccion: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Auditoria",
    auditoriaSchema
);