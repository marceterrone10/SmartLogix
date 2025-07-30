import express from 'express';
import dotenv from 'dotenv';
import { connection } from './database/db.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';


// Initialize the express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware for loggin requests in console
app.use(loggerMiddleware);

// Load environment variables
dotenv.config();

// Start the database connection
connection();

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});