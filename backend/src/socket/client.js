import { io } from 'socket.io-client';

// Token JWT del usuario autenticado
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGQ3ZWQzYTk1NGYyYjA3NzUzMjg2MyIsImVtYWlsIjoibmlnZ2VyQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDI3NTkwOSwiZXhwIjoxNzU0Mjc5NTA5fQ.kyMgf36ORyp8VAtVWV-v7zsA23aG7E6XXitoRKcNQy8';

// ID del ticket al que te querés conectar
const ticketId = '68898204c768793b41c9b12b';

// Conexión al servidor Socket.IO
const socket = io('http://localhost:3000', {
  auth: {
    token: token
  }
});

// Conectado al servidor
socket.on('connect', () => {
  console.log('Conectado al servidor con ID:', socket.id);

  //Unirse a la sala del ticket
  socket.emit('joinTicket', { ticketId });
  console.log(`Unido al ticket ${ticketId}`);

  // Enviar un mensaje al ticket
  socket.emit('sendMessage', {
    ticketId,
    message: 'Hola, necesito asistencia urgente desde client.js'
  });
});

//Escuchar mensajes entrantes del ticket
socket.on('message', (data) => {
  console.log('Mensaje recibido:', data);
});

// Desconexión
socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});
