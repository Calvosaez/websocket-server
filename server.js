const WebSocket = require('ws');

// Usa el puerto asignado por Railway o un puerto predeterminado para desarrollo local
const port = process.env.PORT || 3000; 
const server = new WebSocket.Server({ port });

let clients = [];

// Evento cuando un nuevo cliente se conecta
server.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    clients.push(socket);

    // Manejar mensajes recibidos del cliente
    socket.on('message', (message) => {
        console.log('Mensaje recibido:', message);

        // Envía el mensaje a todos los clientes excepto al remitente
        clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Manejar desconexión del cliente
    socket.on('close', () => {
        console.log('Cliente desconectado');
        clients = clients.filter((client) => client !== socket);
    });
});

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);
