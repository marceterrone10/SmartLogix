import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Ticket from '../models/ticket.model.js';
import dotenv from 'dotenv';
dotenv.config();

let io; 

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    /*  Middleware de autenticación para sockets.
    Antes de permitir la conexión, verifica que el cliente haya enviado un token JWT válido en socket.handshake.auth.token.
    Si el token es válido, se decodifica y se guarda la información del usuario en socket.user.
    Si el token no existe o es inválido, se bloquea la conexión con un error de autenticación.*/
    io.use((socket, next ) => { 
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        };

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch ( error ) {
            return next(new Error('Authentication error'));
        }
    })

    // Este bloque maneja los eventos de conexión de los sockets, este escucha cuando un usuario se conecta.
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.id}`);

        socket.on('joinTicket', async ({ ticketId }) => { // evento para entrar a un ticket específico, en nuestro caso al no tener frontend, se simula la union a un ticket pasandolo manualmente.
            socket.join(ticketId); // El usuario se une a la sala del ticket
            console.log(`User ${socket.user.id} joined ticket ${ticketId}`);
        });

        // Evento para enviar mensajes dentro de un ticket
        // Este evento escucha cuando un usuario envía un mensaje en un ticket específico.
        // Esperamos que el cliente mande un objeto con el ID del ticket y el mensaje.
        // Esto se puede observar mejor en el archivo de socket del cliente.
        socket.on('sendMessage', async ({ ticketId, message }) => { 
            const newMessage = { 
                from: socket.user.email,
                role: socket.user.role,
                message,
                timeStamp: new Date()
            };

            io.to(ticketId).emit('message', newMessage);

            // Guardamos el mensaje en la base de datos
            try {
                await Ticket.findByIdAndUpdate(ticketId, {
                    $push: { messages: newMessage }
                }, { new: true });
                console.log(`Message sent to ticket ${ticketId}`);
            } catch ( error ) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.id}`);
        });
    });
};

export { io };

