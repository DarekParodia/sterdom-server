import * as dr from "./modules/data_receiver.js"

class Sensor {
    constructor(id) {
        this.id = id;
        this.dataids = [];
    }

    addDataID(id) {
        // check if data id arleady is in the list, if not add it
        if (!this.dataids.includes(id)) {
            this.dataids.push(id);
        }
    }
}

document.addEventListener('DOMContentLoaded', async (e) => {
    // get data elements
    const elements = document.querySelectorAll('[class^="data-span"]');
    const sensors = [];

    elements.forEach(element => {
        const sensorID = element.dataset.sensorid;
        const dataID = element.dataset.dataid;

        const sensid = sensors.findIndex(e => e.id === sensorID);
        if (sensid < 0) {
            // create a new object
            const obj = new Sensor(sensorID);
            obj.addDataID(dataID);
            sensors.push(obj);
        } else {
            sensors[sensid].addDataID(dataID);
        }
    })

    console.log(sensors);

    try {
        await dr.waitForConnection();
        console.log("Connected to the server");
    } catch (err) {
        console.error("Server Connection timed out")
    }
    dr.setRequestedData(sensors);

});
