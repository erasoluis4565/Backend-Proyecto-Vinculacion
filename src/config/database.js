import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log('Conexión exitosa a MongoDB local');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};