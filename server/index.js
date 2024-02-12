import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
};
const startServer = async () => {
    try {
        await connectDb();
        app.listen(8080, () => {
            console.log('Server running on port 8080');
        })
    } catch (error) {
        console.error(error);
    }
};

startServer();