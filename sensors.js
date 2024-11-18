const { logger } = require('./logger.js');
const sensorsFile = require('./sensors.json');
const rest = require('./rest.js')
const sensors = [];

class Data {
    constructor(data) {
        this.data = data;
        this.time = new Date();
    }
}
class DataPoint {
    constructor(name, id, type, dbttl) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.dbttl = dbttl;
        this.currentlyRequested = false;
    }

    async dataParse(data) {

    }

    async update() {

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
        this.autofetch = false;
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
                    this.datapoints.push(new DataPoint(el.name, el.id, el.type, el.dbttl));
                } else {
                    logger.warn(`Multiple DataPoints with same ID! Using first mentioned. ID: ${el.id}`);
                }
            }
        }


        this.datapoints.forEach((el) => {
            if (el.dbttl != 0) {
                // data has to be stored in database so we have to fetch it according to cooldown
                this.autofetch = true;
            }
        })

        if (this.autofetch) {
            setTimeout(this.fetch.bind(this), this.cooldown);
        }
    }

    async fetch() {
        const options = {
            host: this.host,
            port: this.port,
            path: this.path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        switch (this.type) {
            case "http":
                rest.getHttp(options, (status, result) => {
                    this.dataParse(result);
                })
                break;
            default:
                logger.error("Wrong Sennsor comunication type:", this.type)
                break;
        }

        if (this.autofetch) {
            setTimeout(this.fetch.bind(this), this.cooldown);
        }
    }

    async dataParse(data) {
        console.log("parsing data: ", data);
        for (let i = 0; i < data.length; i++) {
            this.datapoints[i].dataParse(data[i]);
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

export function setRequestedData(requestedData) {
    // reset first
    sensors.forEach((sensor) => {
        sensor.datapoints.forEach((datapoint) => {
            datapoint.currentlyRequested = false;
        })
    })

    requestedData.forEach((el) => {

    })
    console.log(requestedData);
};