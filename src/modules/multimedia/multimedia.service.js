import cloudinary from '../../config/cloudinary.js';
import Multimedia from './multimedia.model.js';

export const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'agro_vivero_multimedia' }, // Crea automáticamente esta carpeta en tu Cloudinary
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        // Enviamos el buffer del archivo que Multer procesó directamente a la nube
        uploadStream.end(file.buffer);
    });
};

export const deleteImageFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error('Error al eliminar el archivo físico en Cloudinary: ' + error.message);
    }
};

export const multimediaService = {
    // 1. Guardar multimedia asignada a una planta
    createMultimedia: async (file, plantaSlug) => {
        // Subir archivo a internet
        const cloudinaryResult = await uploadImageToCloudinary(file);
        
        // Guardar la referencia en MongoDB local
        const nuevaMultimedia = new Multimedia({
            url: cloudinaryResult.secure_url,
            public_id: cloudinaryResult.public_id,
            planta_slug: plantaSlug
        });

        return await nuevaMultimedia.save();
    },

    // 2. Obtener multimedia por el slug de la planta (Bosquejo genérico)
    getMultimediaByPlantaSlug: async (slug) => {
        // Buscamos en la base de datos todas las que coincidan con el slug recibido
        return await Multimedia.find({ planta_slug: slug });
    },

    // 3. Eliminar multimedia por ID de registro
    deleteMultimedia: async (id) => {
        const archivo = await Multimedia.findById(id);
        if (!archivo) {
            throw new Error('El registro multimedia no existe');
        }

        // Borrar de Cloudinary usando su ID público de la nube
        await deleteImageFromCloudinary(archivo.public_id);

        // Borrar de MongoDB
        await Multimedia.findByIdAndDelete(id);
        return { message: 'Multimedia eliminada exitosamente' };
    }
};