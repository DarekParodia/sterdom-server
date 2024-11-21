import { send } from 'express/lib/response.js';

const sensors = require('./sensors.js')
const { logger } = require('./logger.js');
const clients = [];
// datapoints --maps to-->> [Client, Client...] "client array"
var dataToClientsMap = new Map();
sensors.setSendDataCallback(updateData);

class Client {
    constructor(ws) {
        this.ws = ws;
        this.setupWebSocket();
        this.requestedData = [];
        this.dataToUpdate = [];
        this.connectedAt = new Date().getTime();
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

    /**
     * Adds data which has to be later sent
     * @param {Array} dataids
     * @example{
     *  addDataToUpdate([
 *  {
 *      id: "co",
 *      dataids: {
 *          data: 83.2
 *          time: 52935972359
 *      }
 * },
 * {
 *      id: "cwu",
 *      dataids: {
 *          data: 83.2
 *          time: 52935972359
 *      }
 * }
 * ])
     * } 
     */
    async addDataToUpdate(dataids) {
        let conected = this.dataToUpdate.concat(dataids);
        this.dataToUpdate = conected.filter((item, pos) => conected.indexOf(item) === pos);
    }

    async update() {
        if (this.dataToUpdate.length <= 0)
            return
        let string = JSON.stringify(this.dataToUpdate);
        this.ws.send(string);
        this.dataToUpdate = [];
    }
}

async function sendAll() {
    clients.forEach((client) => {
        client.update();
    })
}

/**
 * This function will mark all datapoints in sensors.js as unrequested and go trought every client to check requested 
 */
export function recheckRequestedData() {
    let reqData = []; // array of data requests
    dataToClientsMap = new Map();

    clients.forEach((client) => {
        for (const key in client.requestedData) {
            if (Object.hasOwnProperty.call(client.requestedData, key)) {
                const element = client.requestedData[key];

                let mapObj = dataToClientsMap.get(element.id);
                if (mapObj) {
                    if (!mapObj.includes(client)) {
                        mapObj.push(client);
                        dataToClientsMap.set(element.id, mapObj);
                    }
                } else {
                    mapObj = []
                    mapObj.push(client);
                    dataToClientsMap.set(element.id, mapObj);
                }

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
    console.log("map length:", dataToClientsMap.size);
    // console.log("clinet mapp:", [...dataToClientsMap.entries()]);
    sensors.setRequestedData(reqData);
}

/**
 *  This function will go trough mapped clients and send to them passed accordingly
 * @param {Array} data array of data to pass. 
 * @example {
 *  updateData([
 *  {
 *      id: "co",
 *      dataids: {
 *          data: 83.2
 *          time: 52935972359
 *      }
 * },
 * {
 *      id: "cwu",
 *      dataids: {
 *          data: 83.2
 *          time: 52935972359
 *      }
 * }
 * ])
 * }
 */
export function updateData(data) {
    data.forEach((el) => {
        let clients = dataToClientsMap.get(el.id);
        clients.forEach((client) => {
            client.addDataToUpdate([el]);
        })
    })

    sendAll();
}

/**
 * Setups a new Client based on ws-express
 * @param {*} ws 
 * @param {*} req 
 */
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