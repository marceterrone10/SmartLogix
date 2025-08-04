import express from 'express';
import dotenv from 'dotenv';
import { connection } from './database/db.js';
import { loggerMiddleware } from './middlewares/logger.middleware.js';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import{ Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { initSocket } from './socket/index.js';

// Initialize the express application
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


// Create an HTTP server
const httpServer = http.createServer(app);

initSocket(httpServer);

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

// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
export { server };