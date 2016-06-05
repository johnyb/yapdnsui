var request = require('request');
var db = require('../db.js');

/* --------------------------------------------------------
*
* RECORDS
* https://doc.powerdns.com/md/httpapi/api_spec/
*
*/

// Handle records listing
exports.list = function (serverId, zoneId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'GET',
                url: server.url + '/servers/localhost/zones/' + zoneId,
                headers: { 'X-API-Key': server.password }
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response);
            });
        });
    });
};

// Handle records delete
exports['delete'] = function (serverId, zoneId, record) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'PATCH',
                url: server.url + '/servers/localhost/zones/' + zoneId,
                json: {
                    'rrsets': [{
                        'name': record.name,
                        'type': record.type,
                        'changetype': 'DELETE',
                        'records': []
                    }]
                },
                headers: {
                    'X-API-Key': server.password,
                    'Content-Type': 'application/json'
                }
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response.body);
            });
        });
    });
};

// Handle records update/add
exports.update = function (serverId, zoneId, record) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            var json = {
                'rrsets': [{
                    name: record.name,
                    type: record.type,
                    changetype: 'REPLACE',
                    records: record.records,
                    ttl: record.ttl
                }]
            };
            request({
                dataType: 'json',
                method: 'PATCH',
                url: server.url + '/servers/localhost/zones/' + zoneId,
                json: json,
                headers: {
                    'X-API-Key': server.password,
                    'Content-Type': 'application/json'
                }
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response);
            });
        });
    });
};

