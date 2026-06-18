import mongoose from 'mongoose';

const multimediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'La URL de la imagen es obligatoria']
    },
    public_id: {
        type: String,
        required: [true, 'El public_id de Cloudinary es obligatorio']
    },
    planta_slug: {
        type: String,
        required: [true, 'El slug de la planta asociada es obligatorio']
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

const Multimedia = mongoose.model('Multimedia', multimediaSchema);
export default Multimedia;