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
                resolve(response);
            });
        });
    };
}

class Config {
    constructor(server) {
        this.server = server;
    }
    servers() {
        return this.server.then(createRequest('/servers')).then((r) => {
            return {
                statusCode: r.statusCode,
                servers: JSON.parse(r.body)
            };
        });
    }
    list() {
        return this.server.then(createRequest('/servers/localhost/config')).then((r) => {
            return {
                statusCode: r.statusCode,
                config: JSON.parse(r.body)
            };
        });
    }
}

module.exports = Config;
