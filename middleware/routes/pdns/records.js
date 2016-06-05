var express = require('express');
var path = require('path');
var database = require('../../libs/db');
var pdnsapi = require('../../libs/pdnsapi');
var router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function (req, res, next, id) {
    console.log('server_id: [%s]', id);
    if (parseInt(id, 10)) {
        database.getServer(id).then((server) => {
            req.server = server;
            return database.list(id);
        }).then((rows) => {
            req.serverlist = rows;
        }).then(next, next);
    } else {
        next();
    }
});

/* -------------------------------------------------*/
/* RECORDS */

/* Get records of a domain */
router.get('/servers/:id/zones/:zone_id/records', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../../public/')
        });
        return;
    }

    pdnsapi.records.list(req.params.id, req.params.zone_id).then((response) => {
        if (response.statusCode !== 200) {
            res.send(response.body);
        } else {
            var json = JSON.parse(response.body);
            res.send(json.rrsets);
        }
    }, (error) => {
        res.send(error);
    });
});

var fs = require('fs');
router.get('/servers/:id/zones/:id/:file', function (req, res, next) {
    fs.stat(path.join(__dirname, '../../../public/', req.params.file), (err, stats) => {
        if (err || !stats.isFile()) return next();
        res.location('/');
        res.sendFile(req.params.file, {
            root: path.join(__dirname, '../../../public/')
        });
    });
});

/* Delete a record */
router['delete']('/servers/:id/zones/:zone_id/records/:record_name/:record_type', function (req, res) {
    console.log(req.params, req.body);
    var record = { 'name': req.params.record_name, 'type': req.params.record_type };
    pdnsapi.records['delete'](req.params.id, req.params.zone_id, record).then((body) => {
        res.send(body);
    }, (error) => {
        res.send(error);
    });
});

/* Add a record */
router.post('/servers/:id/zones/:zone_id/records', function (req, res) {
    pdnsapi.records.update(req.params.id, req.params.zone_id, req.body).then((response) => {
        res.status(response.statusCode).send(response.body);
    }, (error) => {
        res.send(error);
    });
});

router.put('/servers/:id/zones/:zone_id/records/:record_name/:record_type', function (req, res) {
    pdnsapi.records.update(req.params.id, req.params.zone_id, req.body).then((response) => {
        if (response.statusCode !== 200) {
            res.status(response.statusCode).send({ msg: response.body });
        } else {
            res.send(response.body.rrsets);
        }
    }, (error) => {
        res.send(error);
    });
});

module.exports = router;
