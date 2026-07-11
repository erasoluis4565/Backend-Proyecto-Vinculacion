const mongoose = require("mongoose");

const configuracionSchema = new mongoose.Schema({

    proyecto: {
        type: String,
        required: true
    },

    descripcion: {
        type: String
    },

    baseDatos: {
        type: String,
        required: true
    },

    almacenamientoMultimedia: {
        type: String,
        enum: ["Cloudinary"],
        default: "Cloudinary"
    },

    cloudinaryFolderBase: {
        type: String
    },

    versionDatos: {
        type: String
    },

    responsableBaseDatos: {
        type: String
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
    "Configuracion",
    configuracionSchema
);