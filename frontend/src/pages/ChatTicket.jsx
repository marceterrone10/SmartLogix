import { useEffect, useState } from 'react';
import socket from '../socket/socket.js';

const ChatTicket = () => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ticketId = '123456';

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('joinRoom', ticketId);

        socket.on('newMessage', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('newMessage'); // limpiás el listener
            socket.disconnect(); // solo si querés cerrarlo
        };
    }, []);

    const handleSend = () => {
        if (message.trim()) {
            socket.emit('sendMessage', {
                ticketId,
                content: message,
                sender: user ? user.email : 'Usuario Desconocido'
            });
            setMessage('');
        }
    };

    return (
        <div>
            <h2>💬 Chat del Ticket #{ticketId}</h2>
            <div style={{ border: '1px solid #ccc', padding: '1rem', height: '200px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index}><strong>{msg.sender}:</strong> {msg.content}</div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribí un mensaje..."
            />
            <button onClick={handleSend}>Enviar</button>
        </div>
    );
};

export default ChatTicket;
