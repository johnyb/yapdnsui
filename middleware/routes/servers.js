var express = require('express');
var database = require('../libs/db');
var pdnsapi = require('../libs/pdnsapi');
var path = require('path');
var router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function (req, res, next, id) {
    console.log('server_id: [%s]', id);
    console.log(parseInt(id, 10));
    if (parseInt(id, 10) && !/text\/html/.test(req.headers.accept)) {
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

/* GET servers page, when no servers in the list */
router.get('/', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../public/')
        });
        return;
    }
    if (!req.db) { res.redirect('/'); }
    database.list(req, res, function (_req, _res, rows) {
        res.send(rows);
    });
});

/* POST to add server Service */
router.post('/', function (req, res) {
    database.add(req, res, function (err, id) {
        if (err) {
            console.error(err);
            return;
        }
        database.get(req, res, id, function (err2, row) {
            if (err2) {
                console.log(err2);
                return;
            }
            res.send(row);
        });
    });
});

/* Now we have the servers set up, let use it as a middleware */
/* All page below require a valid server and DB */

/* GET servers page. */
router.get('/:id', function (req, res) {
    if (!parseInt(req.params.id, 10)) {
        res.location('/');
        res.sendFile(req.params.id, {
            root: path.join(__dirname, '../../public/')
        });
        return;
    } else if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../public/')
        });
        return;
    }
    if (!req.db || !req.server || !req.params.id) { res.redirect('/'); }

    pdnsapi.config.servers(req, res, function (error, response, body) {
        // If any error redirect to index
        if (!response || response.statusCode !== 200) {
            console.log('Error: connection failed');
            res.msg = {};
            res.msg['class'] = 'alert-warning';
            res.msg.title = 'Error!';
            res.msg.msg = 'Connection failed to ' + req.server.name;
            res.send(res.msg);
        } else {
            var json = JSON.parse(body);
            database.refresh(req, res, json[0], function () {
                res.send({ pdns: json[0] });
            });
        }

    });
});

router['delete']('/:id', function (req, res) {
    console.log('Server delete');
    console.log(req.params);
    console.log(req.server);
    console.log(req.db);

    if (!req.db || !req.params.id) { res.redirect('/servers'); }

    database['delete'](req, res, function () {
        res.send({ result: true });
    });
});

router.put('/:id', function (req, res) {
    console.log('Server update');
    console.log(req.params);
    console.log(req.server);
    console.log(req.db);

    if (!req.db || !req.params.id) { res.redirect('/servers'); }

    database.update(req, res, function () {
        res.send({ result: true });
    });
});

module.exports = router;
