import { io } from 'socket.io-client';

// Token JWT del usuario autenticado
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGQ3ZWQzYTk1NGYyYjA3NzUzMjg2MyIsImVtYWlsIjoibmlnZ2VyQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDM5NzgyMSwiZXhwIjoxNzU0NDAxNDIxfQ.OqeKFJEVcQk65a7xz-65YGuK44V_RgpjFYmdBRqnGKI';

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

// Automatizar una respuesta despues de 2 segundos

socket.on('message', (msg) => {
  // Responder automáticamente después de 2 segundos
  if (msg.role === 'tecnico'){
    setTimeout(() => {
      socket.emit('sendMessage', {
        ticketId,
        message: 'Necesito ayuda con mi problema técnico. ¿Puedes ayudarme?'
      });
    }, 2000);
  };
});

// Desconexión
socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});
