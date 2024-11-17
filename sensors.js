const { logger } = require('./logger.js');
const sensorsFile = require('./sensors.json');
const rest = require('./rest.js')
const sensors = [];

class DataPoint {
    constructor(name, id, type) {
        this.name = name;
        this.id = id;
        this.type = type;
    }
}

class Sensor {
    constructor(name, id, type, cooldown, host, path, port, datapoints) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.cooldown = cooldown;
        this.host = host;
        this.path = path;
        this.port = port;
        this.datapoints = [];
        this.parseDataPoints(datapoints);
    }

    async parseDataPoints(obj) {
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                const el = obj[key];

                // firstly check if datapoints like this arleady exists
                const datapIndx = this.datapoints.findIndex(e => e.id === el.id);
                if (datapIndx < 0) {
                    // object doesn't exist yet
                    this.datapoints.push(new DataPoint(el.name, el.id, el.type));
                } else {
                    logger.warn(`Multiple DataPoints with same ID! Using first mentioned. ID: ${el.id}`);
                }
            }
        }
        console.log(this.datapoints);
    }

    async fetch() {
        switch (this.type) {
            case "http":
                const options = {
                    host: 'somesite.com',
                    port: 443,
                    path: '/some/path',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                rest.getHttp(options, (status, result) => {

                })
                break;
            default:
                logger.error("Wrong Sennsor comunication type:", this.type)
                break;
        }
    }
}

async function parseSensors() {
    for (const key in sensorsFile) {
        if (Object.hasOwnProperty.call(sensorsFile, key)) {
            const el = sensorsFile[key];
            // firstly check if sensors like this arleady exists
            const sensorIndx = sensors.findIndex(e => e.id === el.id);
            if (sensorIndx < 0) {
                // object doesn't exist yet
                sensors.push(new Sensor(el.name, el.id, el.type, el.cooldown, el.host, el.path, el.port, el.datapoints));
            } else {
                logger.warn(`Multiple Sensors with same ID! Using first mentioned and some datapoints might not exist. ID: ${el.id}`);
            }
        }
    }
}

parseSensors();

export function a() { };