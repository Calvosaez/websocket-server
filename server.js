const WebSocket = require('ws');

// Usa el puerto asignado por Railway o un puerto predeterminado para pruebas locales
const port = process.env.PORT || 3000;
const server = new WebSocket.Server({ port });

let clients = [];

server.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    clients.push(socket);

    socket.on('message', (message) => {
        try {
            // Convertir el Buffer recibido en texto
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
    });
});

console.log(`Servidor WebSocket corriendo en el puerto ${port}`);
