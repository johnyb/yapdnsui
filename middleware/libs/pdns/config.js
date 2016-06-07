const request = require('request');

function createRequest(url) {
    return function (server) {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'GET',
                url: server.url + url,
                headers: {
                    'X-API-Key': server.password
                }
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response.body);
            });
        });
    };
}

class Config {
    constructor(server) {
        this.server = server;
    }
    servers() { return this.server.then(createRequest('/servers')); }
    list() { return this.server.then(createRequest('/servers/localhost/config')); }
}

module.exports = Config;
