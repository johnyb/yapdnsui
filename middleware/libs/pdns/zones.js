var request = require('request');
var _ = require('underscore');

/* --------------------------------------------------------
*
* ZONES / DOMAINS
* https://doc.powerdns.com/md/httpapi/api_spec/
*
*/

function getHeaders(req) {
    return {
        'Content-Type': 'application/json',
        'X-API-Key': req.server.password
    };
}

// Handle Zones listing
exports.list = function (req, res, callback) {
    if (req.server.url && req.server.password) {
        request({
            dataType: 'json',
            method: 'GET',
            url: req.server.url + '/servers/localhost/zones',
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};

exports.get = function (req, res, callback) {
    if (req.server.url && req.server.password) {
        request({
            dataType: 'json',
            method: 'GET',
            url: req.server.url + '/servers/localhost/zones/' + req.params.zone_id,
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};

// Handle Zones delete
exports['delete'] = function (req, res, callback) {
    if (req.server.url && req.server.password && req.params.zone_id) {
        request({
            dataType: 'json',
            method: 'DELETE',
            url: req.server.url + '/servers/localhost/zones/' + req.params.zone_id,
            json: { 'rrsets': [{ 'name': req.params.zone_id, 'changetype': 'DELETE', 'records': [], 'comments': [] }] },
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
};

// Handle Zones add/update
exports.add = function (req, res, callback) {
    if (req.server.url && req.server.password && req.body.name && req.body.kind) {
        var json = _.defaults({
            name: req.body.name,
            kind: req.body.kind,
            masters: [],
            nameservers: []
        }, req.body);
        if (req.body.master) json.masters.push(req.body.master);
        delete json.id;
        delete json.url;
        console.log(json);
        request({
            dataType: 'json',
            method: req.method,
            url: req.server.url + '/servers/localhost/zones' + (req.method === 'PUT' ? '/' + req.body.id : ''),
            json: json,
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    } else {
        callback({ msg: 'Missing data' }, res);
    }
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
exports.notify = function (req, res, callback) {
    if (req.server.url && req.server.password && req.params.zone_id) {
        request({
            dataType: 'json',
            method: 'PUT',
            url: req.server.url + '/servers/localhost/zones/' + req.params.zone_id + '/notify',
            headers: getHeaders(req)
        }, function (error, response, body) {
            callback(error, response, body);
        });
    }
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
