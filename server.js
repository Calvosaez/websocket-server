const WebSocket = require('ws');

const port = process.env.PORT || 3000; // Usa el puerto asignado por Railway
const server = new WebSocket.Server({ port });

let clients = [];

server.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    clients.push(socket);

    socket.on('message', (message) => {
        console.log('Mensaje recibido:', message);
        // Envía el mensaje a todos los clientes
        clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
        clients = clients.filter((client) => client !== socket);
    });
});

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);
