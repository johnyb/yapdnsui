'use strict';
const db = require('./db.js');

class PDNSAPI {
    constructor(serverId) {
        this.serverId = serverId;
        this.server = db.getServer(serverId);
    }

    get config() { return require('./pdns/config.js'); }
    get zones() { return require('./pdns/zones.js'); }
    get records() { return require('./pdns/records.js'); }
    get stats() { return require('./pdns/statistics.js'); }
}

module.exports = PDNSAPI;
