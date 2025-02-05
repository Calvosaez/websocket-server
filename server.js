const WebSocket = require('ws');

// Usa el puerto asignado por Railway o un puerto predeterminado (3000 para pruebas locales)
const port = process.env.PORT || 3000; 
const server = new WebSocket.Server({ port });

let clients = [];

// Evento cuando un cliente se conecta
server.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    clients.push(socket);

    // Manejar mensajes enviados por el cliente
    socket.on('message', (message) => {
        console.log('Mensaje recibido:', message);

        // Difundir el mensaje a todos los clientes conectados
        clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Manejar la desconexión del cliente
    socket.on('close', () => {
        console.log('Cliente desconectado');
        clients = clients.filter((client) => client !== socket);
    });
});

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);
