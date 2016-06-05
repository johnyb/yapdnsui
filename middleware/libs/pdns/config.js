var request = require('request');
var db = require('../db.js');

// Handle servers description
exports.servers = function (serverId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'GET',
                url: server.url + '/servers',
                headers: {
                    'X-API-Key': server.password
                }
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response.body);
            });
        });
    });
};

// Handle configuration listing
exports.list = function (serverId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'GET',
                url: server.url + '/servers/localhost/config',
                headers: {
                    'X-API-Key': server.password
                }
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response.body);
            });
        });
    });
};
