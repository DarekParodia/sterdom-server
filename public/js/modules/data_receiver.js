const ws = new WebSocket(`ws://${window.location.hostname}:33333/`);
var receivers = [];

ws.onopen = function () {
    console.log("data receiver websocket connection opened");
}

ws.onmessage = function (e) {
    try {
        console.log("message received:", e.data);

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

export async function waitForConnection() {
    return new Promise((resolve) => {
        if (ws.readyState === WebSocket.OPEN) {
            resolve();
        } else {
            let timeout = setTimeout(() => {
                if (ws.readyState !== WebSocket.OPEN) {
                    throw new Error('WebSocket connection failed');
                }
            }, 10000); // Wait for 10 seconds before timing out

            ws.onopen = () => {
                clearTimeout(timeout);
                resolve();
            };
        }
    });
}

export async function setRequestedData(obj) {
    let data = {
        type: "set_requested_data",
        data: obj
    }
    let json_str = JSON.stringify(data);
    ws.send(json_str);
    console.log("setting requested data to:", data);

}

export class DataReceiver {
    constructor(dataID, callback = (json) => { }) {
        receivers.push(this);
        this.dataID = dataID;
        this.callback = callback;
    }
}
