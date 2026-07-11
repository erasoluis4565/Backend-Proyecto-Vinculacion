const mongoose = require("mongoose");

const noticiaSchema = new mongoose.Schema({

    slug: {
        type: String,
        required: true,
        unique: true
    },

    titulo: {
        type: String,
        required: true
    },

    resumen: {
        type: String,
        required: true
    },

    contenido: {
        type: String,
        required: true
    },

    categoria: {
        type: String
    },

    autorCorreo: {
        type: String
    },

    portada: {

        secureUrl: {
            type: String
        },

        publicId: {
            type: String
        }

    },

    multimediaIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Multimedia"
    }],

    estado: {
        type: String,
        enum: [
            "BORRADOR",
            "PUBLICADO",
            "INACTIVO"
        ],
        default: "BORRADOR"
    },

    fechaPublicacion: {
        type: Date,
        required: true
    },

    fechaActualizacion: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Noticia",
    noticiaSchema
);