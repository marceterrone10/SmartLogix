import mongoose from 'mongoose';
import config from '../config/environments.js';

const { connectionString } = config.database;

export async function connection() {
    try {
        await mongoose.connect(connectionString); 
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error connecting to the database:', error);
    }
};

