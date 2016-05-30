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
/* STATS */

/* GET stats page. */
router.get('/servers/:id/statistics', function (req, res, next) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../../public/')
        });
        return;
    }
    return next();
});

/* GET the statistics dump for graph */
router.get('/servers/:id/statistics/dump', function (req, res) {
    console.log(req.db);
    console.log(req.params);
    console.log(req.params.id);
    // If missing value redirect to index or to an error page!!!
    if (!req.db && !req.server) { res.redirect('/'); }
    pdnsapi.stats.statistics(req, res, function (error, response, body) {
        if (!body) {
            console.log(error);
            res.send(error, { 'Content-type': 'text/json' }, 200);
        } else {
            // Do more stuff with 'body' here
            //console.log(req);
            //console.log(body);
            var json = JSON.parse(body);
            var timestamp = new Date().getTime(); // current time
            //var timestamp = req.query._;
            var arr = {};
            //console.log(json);
            for (var i in json) {
                arr[json[i].name] = [timestamp, parseInt(json[i].value, 10)];
            }
            res.send(arr, { 'Content-type': 'text/json' }, 200);
        }
    });
});

module.exports = router;
