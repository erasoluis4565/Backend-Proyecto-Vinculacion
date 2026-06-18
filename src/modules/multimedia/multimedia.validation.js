import multer from 'multer';
import path from 'path';

// 1. Configuración del almacenamiento temporal en memoria
// Guardamos el archivo en memoria temporalmente (Buffer) para enviarlo directo a Cloudinary.
const storage = multer.memoryStorage();

// 2. Filtro de formato (aqui se valida el tipo de archivo)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|webp/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Archivo aceptado
    } else {
        cb(new Error('❌ Formato no soportado. Solo se permiten imágenes (jpeg, jpg, png, webp)'));
    }
};

// 3. Inicialización de Multer con límite de tamaño de 5MB
export const uploadSingleImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 Megabytes en bytes
    },
    fileFilter: fileFilter
}).single('imagen'); // El campo en la petición HTTP del frontend deberá llamarse 'imagen' :p