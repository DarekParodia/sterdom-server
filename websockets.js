const sensors = require('./sensors.js')
const clients = [];

class Client {
    constructor(ws) {
        this.ws = ws;
        this.setupWebSocket();
    }

    setupWebSocket() {
        this.ws.on('message', msg => this.parseMessage(msg));
    }

    parseMessage(msg) {
        const parsedMsg = JSON.parse(msg);
        console.log("message received:", parsedMsg);

        switch (parsedMsg.type) {
            case "set_requested_data":
                this.requestedData = parsedMsg.data;
                break;
            default:
                console.log("unknown msg type:", parsedMsg.type);

        }
    }
}

export function appFunc(ws, req) {
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
    clients.push(new Client(ws));
}