var clients = [];

export function appFunc(ws, req) {
    clients.push(ws);

    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
}

export function broadcast(dataID, data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ id: dataID, content: data }));
        }
    });
}