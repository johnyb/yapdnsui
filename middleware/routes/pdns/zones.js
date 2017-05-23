const express = require('express');
const path = require('path');
const PDNSAPI = require('../../libs/pdnsapi');
const router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function (req, res, next, id) {
    if (parseInt(id, 10)) {
        req.api = new PDNSAPI(id);
    }
    next();
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
    req.api.zones.list(req.params.id).then((response) => {
        const json = JSON.parse(response.body);
        res.send(json);
    }, (err) => { res.send(err); });
});
router.get('/servers/:id/zones/:zone_id', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../../public/')
        });
        return;
    }
    req.api.zones.get(req.params.id, req.params.zone_id).then((body) => {
        let json = JSON.parse(body);
        if (json.rrsets) delete json.rrsets;
        res.send(json);
    }, (error) => {
        res.status(error.code).send({ msg: error.msg });
    });
});

const fs = require('fs');
router.get('/servers/:id/:file', function (req, res, next) {
    fs.stat(path.join(__dirname, '../../../public/', req.params.file), (err, stats) => {
        if (err || !stats.isFile()) return next();
        res.location('/');
        res.sendFile(req.params.file, {
            root: path.join(__dirname, '../../../public/')
        });
    });
});
router.get('/servers/:id/zones/:file', function (req, res, next) {
    fs.stat(path.join(__dirname, '../../../public/', req.params.file), (err, stats) => {
        if (err || !stats.isFile()) return next();
        res.location('/');
        res.sendFile(req.params.file, {
            root: path.join(__dirname, '../../../public/')
        });
    });
});

/* Delete a domain */
router['delete']('/servers/:id/zones/:zone_id', function (req, res) {
    req.api.zones['delete'](req.params.id, req.params.zone_id).then((result) => {
        res.send(result);
    }, (error) => {
        res.send(error);
    });
});

/* Add a domain */
router.post('/servers/:id/zones', function (req, res) {
    req.api.zones.add(req.params.id, req.body).then((body) => {
        res.send(body);
    }, (error) => {
        res.send(error);
    });
});

router.put('/servers/:id/zones/:zone_id', function (req, res) {
    req.api.zones.add(req.params.id, req.params.zone_id, req.body).then((body) => {
        res.send(body);
    }, (error) => {
        res.send(error);
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
    req.api.zones['import'](req, res, function (error, response) {
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
    req.api.zones['export'](req, res, function (error, response, body) {
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
    req.api.zones.notify(req.params.id, req.params.zone_id).then((body) => {
        // If any error redirect to index
        res.send(body);
    }, (error) => {
        res.send(error);
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
    req.api.zones.retrieve(req, res, function (error, response, body) {
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
