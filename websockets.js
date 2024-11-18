const sensors = require('./sensors.js')
const { logger } = require('./logger.js');
const clients = [];

class Client {
    constructor(ws) {
        this.ws = ws;
        this.setupWebSocket();
        this.requestedData = [];
    }

    async setupWebSocket() {
        this.ws.on('message', msg => this.parseMessage(msg));
    }

    async parseMessage(msg) {
        const parsedMsg = JSON.parse(msg);

        switch (parsedMsg.type) {
            case "set_requested_data":
                this.requestedData = parsedMsg.data;
                recheckRequestedData();
                break;
            default:
                console.log("unknown msg type:", parsedMsg.type);

        }
    }
}

/**
 * This function will mark all datapoints in sensors.js as unrequested and go trought every client to check requested 
 */
export function recheckRequestedData() {
    let reqData = []; // array of data requests

    clients.forEach((client) => {
        for (const key in client.requestedData) {
            if (Object.hasOwnProperty.call(client.requestedData, key)) {
                const element = client.requestedData[key];

                // check if it arleady exists in reqData
                const index = reqData.findIndex(e => e.id === element.id);
                if (index < 0) {
                    reqData.push({
                        id: element.id,
                        dataids: element.dataids
                    })
                } else {
                    // add non existing data ids
                    let conected = reqData[index].dataids.concat(element.dataids);
                    reqData[index].dataids = conected.filter((item, pos) => conected.indexOf(item) === pos);
                }

            }
        }
    })
    sensors.setRequestedData(reqData);
}

export function setupWebsocketExpress(ws, req) {
    ws.on('close', () => {
        const index = clients.findIndex(e => e.ws === ws);
        if (index !== -1) {
            clients.splice(index, 1);
        }
        console.log("remaining clients: ", clients.length);
    });
    clients.push(new Client(ws));
    logger.info("New client connected")
}