var express = require('express');
var path = require('path');
var database = require('../../libs/db');
var pdnsapi = require('../../libs/pdnsapi');
var router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function (req, res, next, id) {
    console.log('pdns_domains.js server_id: [%s]', id);
    if (parseInt(id, 10)) {
        database.get(req, res, id, function (err, server) {
            if (err) {
                return next(err);
            } else if (!server) {
                return next(new Error('failed to load server'));
            }
            req.server = server;
            database.list(req, res, function (_req, _res, rows) {
                if (!rows) {
                    return next(new Error('failed to load servers'));
                }
                req.serverlist = rows;
                next();
            });
        });
    } else {
        next();
    }
});

/* -------------------------------------------------*/
/* DOMAINS */

/* GET domains page. */
router.get('/servers/:id/zones', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../../public/')
        });
        return;
    }
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.zones.list(req, res, function (error, response, body) {
        // If any error redirect to index
        if (!body) {
            console.log(error);
            res.redirect('/');
        } else {
            var json = JSON.parse(body);
            res.send(json);
        }
    });
});
var fs = require('fs');
router.get('/servers/:id/:file', function (req, res, next) {
    fs.exists(path.join(__dirname, '../../../public/', req.params.file), (exists) => {
        if (!exists) return next();
        res.location('/');
        res.sendFile(req.params.file, {
            root: path.join(__dirname, '../../../public/')
        });
    });
});

/* Delete a domain */
router['delete']('/servers/:id/zones/:zone_id', function (req, res) {
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.zones['delete'](req, res, function (error, response) {
        // If any error redirect to index
        if (error && response.statusCode !== 204) {
            res.send({ result: false, msg: error });
        } else {
            res.send({ result: true });
        }
    });
});

/* Add a domain */
router.post('/servers/:id/zones', function (req, res) {
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }

    pdnsapi.zones.add(req, res, function (error, response, body) {
        // If any error redirect to index
        if (error && response.statusCode !== 204) {
            console.log(error);
            res.send({ result: false, msg: error });
        } else {
            res.send(body);
        }
    });
});

/* Import a domain */
router.post('/servers/:id/import', function (req, res) {
    console.log('Add a domain');
    console.log(req.db);
    console.log(req.params.id);
    console.log(req.body.name);
    console.log(req.body.type);
    console.log(req.body.master);
    console.log(req.body.zone);
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.zones['import'](req, res, function (error, response) {
        // If any error redirect to index
        if (error && response.statusCode !== 204) {
            console.log(error);
            res.redirect('/servers');
        } else {
            res.redirect('/servers/' + req.server.id + '/domains');
        }
    });
});

/* Export a domain */
router.get('/servers/:id/export/:zone_id', function (req, res) {
    console.log('Export a domain');
    console.log(req.db);
    console.log(req.params.id);
    console.log(req.params.zone_id);
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.zones['export'](req, res, function (error, response, body) {
        console.log(body);
        // If any error redirect to index
        if (error && response.statusCode !== 200) {
            console.log(error);
            res.redirect('/servers');
        } else {
            res.setHeader('Content-disposition', 'attachment; filename=' + req.params.zone_id + 'axfr');
            res.setHeader('Content-type', 'text/plain');
            res.send(body);
        }
    });
});

/* Notify a domain */
router.get('/servers/:id/notify/:zone_id', function (req, res) {
    console.log('Notify a domain');
    console.log(req.db);
    console.log(req.params.id);
    console.log(req.params.zone_id);
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.zones.notify(req, res, function (error, response, body) {
        console.log(body);
        // If any error redirect to index
        if (error && response.statusCode !== 200) {
            console.log(error); res.send(error);
        } else {
            res.send(body);
        }
    });
});

/* Retrieve a domain */
router.get('/retrieve/:zone_id', function (req, res) {
    console.log('Retrieve a domain');
    console.log(req.db);
    console.log(req.params.id);
    console.log(req.params.zone_id);
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.zones.retrieve(req, res, function (error, response, body) {
        console.log(body);
        // If any error redirect to index
        if (error && response.statusCode !== 200) {
            console.log(error); res.send(error);
        } else {
            res.send(body);
        }
    });
});

module.exports = router;
