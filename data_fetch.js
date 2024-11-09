var fetchers = [];

class Fetcher {
    /**
     * 
     * @param {Array} ids array of id's that's data is related to. for example if data is [15.2, 25.4] and id's are ["temp1", "temp2"] 15.2 will be sent with id "temp1" and 25.4 will be sent with id "temp2" 
     * @param {Number} cooldown how often to fetch data
     * @param {Function(dataID, data)} callback function to call after fetch
     */
    constructor(ids, cooldown, callback = (dataID, data) => { }) {
        this.callback = callback;
        this.cooldown = cooldown;
        this.ids = ids;
        this.loopEnabled = false;
    }

    fetch() {
        // implement fetching
    }
}

class NumberFetcher extends Fetcher {
    constructor(host, ids, cooldown, callback = (dataID, data) => { }) {
        super(ids, cooldown, callback);
        this.host = host;
    }

    async fetch() {
        // ping http server and get data
        let dataid = "";
        let data = {};

        this.callback(dataid, data);

        if (this.loopEnabled) {
            setTimeout(this.fetch, this.cooldown);
        }
    }
}