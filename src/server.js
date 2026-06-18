import { env } from './config/env.js'; 

import app from './app.js';
import { connectDB } from './config/database.js';

const startServer = async () => {
    // 1. Conectar a la Base de Datos local
    await connectDB();

    // 2. Escuchar en el puerto configurado
    app.listen(env.PORT, () => {
        console.log(`🚀 Servidor corriendo localmente en: http://localhost:${env.PORT}`);
    });
};

startServer();