const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const server = new WebSocket.Server({ port });

let clients = [];

server.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    clients.push(socket);

    // Enviar actualización de usuarios conectados a todos
    broadcastUserCount();

    socket.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('Mensaje recibido:', data);

            // Reenviar el mensaje a todos los clientes conectados
            clients.forEach((client) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        } catch (error) {
            console.error('Error procesando el mensaje:', error.message);
        }
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
        clients = clients.filter((client) => client !== socket);
        broadcastUserCount();
    });
});

// Función para enviar la cantidad de usuarios conectados
function broadcastUserCount() {
    const userCount = clients.length;
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'updateUsers', count: userCount }));
        }
    });
}

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);
