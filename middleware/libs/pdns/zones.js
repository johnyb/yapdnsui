const request = require('request');
const db = require('../db.js');
const _ = require('underscore');

/* --------------------------------------------------------
*
* ZONES / DOMAINS
* https://doc.powerdns.com/md/httpapi/api_spec/
*
*/

function getHeaders(server) {
    return {
        'Content-Type': 'application/json',
        'X-API-Key': server.password
    };
}

// Handle Zones listing
exports.list = function (serverId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'GET',
                url: server.url + '/servers/localhost/zones',
                headers: getHeaders(server)
            }, function (error, response, body) {
                if (error) return reject();
                resolve(response, body);
            });
        });
    });
};

exports.get = function (serverId, zoneId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'GET',
                url: server.url + '/servers/localhost/zones/' + zoneId,
                headers: getHeaders(server)
            }, function (error, response, body) {
                if (error) return reject(error);
                resolve(body);
            });
        });
    });
};

// Handle Zones delete
exports['delete'] = function (serverId, zoneId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'DELETE',
                url: server.url + '/servers/localhost/zones/' + zoneId,
                json: { 'rrsets': [{ 'name': zoneId, 'changetype': 'DELETE', 'records': [], 'comments': [] }] },
                headers: getHeaders(server)
            }, function (error, response, body) {
                if (error) return reject(error);
                resolve(body);
            });
        });
    });
};

// Handle Zones add/update
exports.add = function (serverId, zoneId, data) {
    if (typeof data === 'undefined') {
        data = zoneId;
        zoneId = null;
    }
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            let json = _.defaults({
                name: data.name,
                kind: data.kind,
                masters: [],
                nameservers: []
            }, data);
            if (data.master) json.masters.push(data.master);
            delete json.id;
            delete json.url;
            request({
                dataType: 'json',
                method: zoneId === null ? 'POST' : 'PUT',
                url: server.url + '/servers/localhost/zones' + (zoneId === null ? '' : '/' + zoneId),
                json: json,
                headers: getHeaders(server)
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response.body);
            });
        });
    });
};

// Handle Zones import
exports['import'] = function (req, res, callback) {
    if (req.server.url && req.server.password && req.params.zone_id && req.body.name && req.body.type && req.body.zone) {
        request({
            dataType: 'json',
            method: 'POST',
            url: req.server.url + '/servers/localhost/zones',
            json: { 'kind': req.body.type, 'name': req.body.name, 'masters': [req.body.master], 'nameservers': [], 'zone': req.body.zone },
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};

// Handle Zones export
exports['export'] = function (req, res, callback) {
    if (req.server.url && req.server.password && req.params.zone_id) {
        request({
            dataType: 'json',
            method: 'GET',
            url: req.server.url + '/servers/localhost/zones/' + req.params.zone_id + '/export',
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};

// Handle Zone notify
exports.notify = function (serverId, zoneId) {
    return db.getServer(serverId).then((server) => {
        return new Promise((resolve, reject) => {
            request({
                dataType: 'json',
                method: 'PUT',
                url: server.url + '/servers/localhost/zones/' + zoneId + '/notify',
                headers: getHeaders(server)
            }, function (error, response) {
                if (error) return reject(error);
                resolve(response.body);
            });
        });
    });
};

// Handle Zone axfr-retrieve
exports.retrieve = function (req, res, callback) {
    if (req.server.url && req.server.password && req.params.zone_id) {
        request({
            dataType: 'json',
            method: 'PUT',
            url: req.server.url + '/servers/localhost/zones/' + req.params.zone_id + '/axfr-retrieve',
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};

// Handle Zone check - Not yet implemented.
exports.check = function (req, res, callback) {
    if (req.server.url && req.server.password && req.params.zone_id) {
        request({
            dataType: 'json',
            method: 'PUT',
            url: req.server.url + '/servers/localhost/zones/' + req.params.zone_id + '/check',
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};
