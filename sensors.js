const { logger } = require('./logger.js');
const sensorsFile = require('./sensors.json');
const sensors = [];

class DataPoint {
    constructor(name, id, type) {
        this.name = name;
        this.id = id;
        this.type = type;
    }
}

class Sensor {
    constructor(name, id, type, cooldown, host, datapoints) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.cooldown = cooldown;
        this.host = host;
        this.datapoints = [];
        this.parseDataPoints(datapoints);
    }

    parseDataPoints(obj) {

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
                sensors.push(new Sensor(el.name, el.id, el.type, el.cooldown, el.host, el.datapoints));
            } else {
                logger.warn(`Multiple Sensors with same ID! Using first mentioned. ID: ${el.id}`);
            }
        }
    }
}

parseSensors();

export function a() { };