import { multimediaService } from './multimedia.service.js';

export const multimediaController = {
    // POST /api/admin/multimedia
    upload: async (req, res) => {
        try {
            // Validar que Multer haya capturado el archivo
            if (!req.file) {
                return res.status(400).json({ error: 'Por favor, proporciona una imagen válida.' });
            }

            // Validar que se asocie a una planta mediante su slug
            const { planta_slug } = req.body;
            if (!planta_slug) {
                return res.status(400).json({ error: 'El campo planta_slug es obligatorio para asociar la imagen.' });
            }

            const resultado = await multimediaService.createMultimedia(req.file, planta_slug);
            res.status(201).json({
                message: 'Imagen subida y registrada exitosamente.',
                data: resultado
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET /api/plantas/:slug/multimedia
    getByPlanta: async (req, res) => {
        try {
            const { slug } = req.params;
            const multimedia = await multimediaService.getMultimediaByPlantaSlug(slug);
            
            res.status(200).json({
                planta_slug: slug,
                total_archivos: multimedia.length,
                multimedia: multimedia
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE /api/admin/multimedia/:id
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const resultado = await multimediaService.deleteMultimedia(id);
            res.status(200).json(resultado);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};