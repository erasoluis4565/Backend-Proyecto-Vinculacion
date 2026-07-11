const mongoose = require("mongoose");

const fuenteSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true
    },

    tipo: {
        type: String,
        enum: [
            "Word",
            "PDF",
            "Libro",
            "Artículo",
            "Sitio web",
            "Entrevista",
            "Otro"
        ],
        required: true
    },

    autor: {
        type: String
    },

    anio: {
        type: Number
    },

    descripcion: {
        type: String
    },

    urlDocumento: {
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
    "Fuente",
    fuenteSchema
);