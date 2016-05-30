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
/* GET configuration page. */
router.get('/servers/:id/configuration', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../../public/')
        });
        return;
    }

    if (!req.db && !req.server) { res.redirect('/'); } // TODO warm user if missing a DB or a valid server
    pdnsapi.config.list(req, res, function (error, response, body) {
        // If any error redirect to index
        if (!body) {
            res.send({ msg: error });
        } else {
            var json = JSON.parse(body);
            res.send(json);
        }
    });
});

module.exports = router;
