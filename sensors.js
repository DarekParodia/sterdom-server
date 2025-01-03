const { logger } = require('./logger.js');
const sensorsFile = require('./sensors.json');
const rest = require('./rest.js')
const websocketManager = require('./websockets.js');
const sensors = [];
var sendDataCallback = function (data) { }

class DataPoint {
    constructor(name, id, type, dbttl) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.dbttl = dbttl;
        this.currentlyRequested = false;
        this.requestedDataids = [];
        this.dataToSend = {};
        this.currentData = null;
        this.previousData = null;
    }

    async dataParse(data) {
        console.log("Parsing", data);
        this.dataToSend = { id: this.id, dataids: {} };

        this.requestedDataids.forEach((dataid) => {
            switch (dataid) {
                case "data":
                    this.dataToSend.dataids.data = data;
                    this.previousData = this.currentData;
                    this.currentData = data;
                    break;
                case "time":
                    this.dataToSend.dataids.time = new Date().getTime();
            }
        })
    }

    async hasChanged() {
        if (this.currentData != this.previousData)
            return true;
        else
            return false;
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
        this.currentlyRequesting = false;
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

        if (this.autofetch || this.currentlyRequesting) {
            setTimeout(this.fetch.bind(this), this.cooldown);
        }
    }

    async dataParse(data) {
        console.log("parsing data: ", data);
        let dataToSend = [];
        for (let i = 0; i < data.length; i++) {
            await this.datapoints[i].dataParse(data[i]);
            if (await this.datapoints[i].hasChanged())
                dataToSend.push(this.datapoints[i].dataToSend);
        }
        if (dataToSend.length > 0)
            sendDataCallback(dataToSend);
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
    console.log(requestedData);
    // reset first
    sensors.forEach((sensor) => {
        sensor.currentlyRequesting = false;
        sensor.datapoints.forEach((datapoint) => {
            let indx = requestedData.findIndex(e => e.id === datapoint.id);
            if (indx >= 0) {
                datapoint.currentlyRequested = true;
                datapoint.requestedDataids = requestedData[indx].dataids;
                sensor.currentlyRequesting = true;
                requestedData.splice(indx, 1);
                sensor.fetch();
            } else {
                datapoint.currentlyRequested = false;
            }
        })
    })
};

export function setSendDataCallback(callback) {
    sendDataCallback = callback;
}