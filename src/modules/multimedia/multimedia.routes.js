import { Router } from 'express';
import { multimediaController } from './multimedia.controller.js';
import { uploadSingleImage } from './multimedia.validation.js';

const router = Router();

// Endpoint público: Obtener multimedia de una planta por su slug
router.get('/plantas/:slug/multimedia', multimediaController.getByPlanta);

// Endpoint administrativo: Subir una imagen (aplica el middleware de Multer para validar los 5MB)
router.post('/admin/multimedia', uploadSingleImage, multimediaController.upload);

// Endpoint administrativo: Eliminar una imagen de la base de datos y Cloudinary por su ID de MongoDB
router.delete('/admin/multimedia/:id', multimediaController.delete);

export default router;