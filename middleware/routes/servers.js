const express = require('express');
const database = require('../libs/db');
const path = require('path');
const router = express.Router();

// Route middleware to validate :id
// Execute for all request
// It return the full server object from the DB
router.param('id', function (req, res, next, id) {
    if (parseInt(id, 10) && !/text\/html/.test(req.headers.accept)) {
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

/* GET servers page, when no servers in the list */
router.get('/', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../public/')
        });
        return;
    }
    database.list().then((rows) => {
        res.send(rows);
    }, (err) => {
        res.status(400).send(err);
    });
});

/* POST to add server Service */
router.post('/', function (req, res) {
    database.add(req.body).then(function (id) {
        return database.getServer(id);
    }).then(function (row) {
        res.send(row);
    });
});

/* Now we have the servers set up, let use it as a middleware */
/* All page below require a valid server and DB */

router['delete']('/:id', function (req, res) {
    database['delete'](req.params.id).then(() => {
        res.send();
    }, (err) => {
        res.send(err);
    });
});

router.put('/:id', function (req, res) {
    database.update(req.params.id, req.body).then((row) => {
        res.send(row);
    }, (err) => {
        res.send(err);
    });
});

module.exports = router;
