const ws = new WebSocket(`ws://${window.location.hostname}:33333`);
var receivers = [];

ws.onopen = function () {
    console.log("data receiver websocket connection opened");
}

ws.onmessage = function (e) {
    try {
        let data = JSON.parse(e.data);
        let id = data.id;
        let content = data.content;
        callReceivers(id, content)
    }
    catch (err) {
        console.error("Error: Websocket Data invalid: " + e.data);

    }
}

function callReceivers(id, json) {
    receivers.forEach(element => {
        if (element.dataID == id) {
            element.callback(json);
        }
    });
}

export class DataReceiver {
    constructor(dataID, callback = (json) => { }) {
        receivers.push(this);
        this.dataID = dataID;
        this.callback = callback;
    }
}
