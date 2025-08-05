import { io } from 'socket.io-client';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTFmYzYyNmYyNjkzOWUxZThiZDhkYSIsImVtYWlsIjoidGVjbmljb0BwcnVlYmEuY29tIiwicm9sZSI6InRlY25pY28iLCJpYXQiOjE3NTQzOTc4MDYsImV4cCI6MTc1NDQwMTQwNn0.aHKDpquLJ3H81-WGMZ0NYguGqgaR9fAXz1KOjIZ1T5U";
const ticketId = "68898204c768793b41c9b12b";

const socket = io('http://localhost:3000', {
    auth: {
        token: token
    }
});

socket.on('connect', () => {
    console.log('Tecnico conectado al servidor con ID:', socket.id);

    socket.emit('joinTicket', { ticketId });
    console.log(`Unido al ticket ${ticketId}`);

    // Simulación de envío de mensaje con 2 segundos de retraso

    setTimeout(() => {
        socket.emit('sendMessage', {
            ticketId,
            message: 'Hola, en que puedo ayudarte?'
        });
    }, 2000);
});

socket.on('message', (data) => {
    console.log('Mensaje recibido:', data);
});

socket.on('disconnect', () => {
  console.log('Tecnico desconectado');
});