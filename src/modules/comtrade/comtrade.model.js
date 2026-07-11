const mongoose = require("mongoose");

const importacionExportacionSchema =
new mongoose.Schema({

    slug: {
        type: String,
        required: true,
        unique: true
    },

    plantaSlug: {
        type: String,
        required: true
    },

    nombreComun: {
        type: String,
        required: true
    },

    nombreCientifico: {
        type: String,
        required: true
    },

    productoComercial: {
        type: String,
        required: true
    },

    tipoProductoComercial: {
        type: String,
        required: true
    },

    hsCode: {
        type: String,
        required: true
    },

    hsDescripcion: {
        type: String,
        required: true
    },

    criterioSeleccionHS: {
        type: String
    },

    paisReportante: {

        nombre: String,

        codigoM49: Number

    },

    flujosConsulta: [

        String

    ],

    comtrade: {

        fuente: String,

        clasificacion: String,

        frecuencia: String,

        partner: String,

        partnerCode: Number,

        observacion: String

    },

    estado: {

        type: String,

        enum: [

            "ACTIVO",

            "PENDIENTE_REVISION"

        ],

        default: "ACTIVO"

    },

    fechaRegistro: {

        type: Date,

        default: Date.now

    },

    fechaActualizacion: {

        type: Date,

        default: Date.now

    }

},
{

    collection:
    "importacion_exportacion"

});

module.exports =
mongoose.model(

    "ImportacionExportacion",

    importacionExportacionSchema

);