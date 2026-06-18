import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
// Importamos tus rutas multimedia
import multimediaRoutes from './modules/multimedia/multimedia.routes.js';

const app = express();

// Middlewares obligatorios
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Registro de tus rutas modulares
app.use('/api', multimediaRoutes);

// Endpoint obligatorio: Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend funcionando"
    });
});
// Middleware global para atrapar errores de Multer de forma limpia
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Errores específicos de Multer (ej. archivo muy pesado, campo incorrecto)
        return res.status(400).json({ error: `Error de carga: ${err.message}` });
    } else if (err) {
        // Cualquier otro error del sistema
        return res.status(500).json({ error: err.message });
    }
    next();
});

export default app;