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
    console.log('Server add');
    console.log(req.db);
    console.log(req.body);
    // Redirect to index if missing value from the form
    //if (!req.db || !req.body.url || !req.body.password) { res.redirect('/servers'); }
    // Do the job
    console.log('Add entry in db');
    database.add(req, res, function () {
        res.redirect('/servers');
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
        } else {
            var json = JSON.parse(body);
            console.log(json[0].type);
            database.refresh(req, res, json[0], function () {
                console.log('db refresh');
            });

            res.msg = json[0];
            res.msg['class'] = 'alert-success';
            res.msg.title = 'Success!';
            res.msg.msg = 'Connected to ' + req.server.name + ' ' + json[0].type + ' ' + json[0].daemon_type + ' Version ' + json[0].version;
        }

        res.send(res.msg);
    });
});

router['delete']('/:id', function (req, res) {
    console.log('Server delete');
    console.log(req.params);
    console.log(req.server);
    console.log(req.db);

    if (!req.db || !req.params.id) { res.redirect('/servers'); }

    database['delete'](req, res, function () {
        res.redirect('/servers');
    });
});

router.put('/:id', function (req, res) {
    console.log('Server update');
    console.log(req.params);
    console.log(req.server);
    console.log(req.db);

    if (!req.db || !req.params.id) { res.redirect('/servers'); }

    database.update(req, res, function () {
        res.redirect('/servers');
    });
});

module.exports = router;
