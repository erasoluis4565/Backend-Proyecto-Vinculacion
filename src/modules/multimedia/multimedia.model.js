const mongoose = require("mongoose");

const multimediaSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true
    },

    descripcion: {
        type: String
    },

    tipo: {
        type: String,
        enum: [
            "IMAGEN",
            "VIDEO",
            "DOCUMENTO"
        ],
        required: true
    },

    url: {
        type: String,
        required: true
    },

    publicId: {
        type: String,
        required: true
    },

    proveedor: {
        type: String,
        default: "Cloudinary"
    },

    estado: {
        type: String,
        enum: [
            "ACTIVO",
            "INACTIVO"
        ],
        default: "ACTIVO"
    },

    fechaRegistro: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    "Multimedia",
    multimediaSchema
);