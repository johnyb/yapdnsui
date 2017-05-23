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
    req.api.stats.statistics(req, res, function (error, response, body) {
        if (!body) {
            res.send(error, { 'Content-type': 'text/json' }, 200);
        } else {
            // Do more stuff with 'body' here
            //console.log(req);
            //console.log(body);
            const json = JSON.parse(body);
            const timestamp = new Date().getTime(); // current time
            //const timestamp = req.query._;
            const arr = {};
            //console.log(json);
            for (const i in json) {
                arr[json[i].name] = [timestamp, parseInt(json[i].value, 10)];
            }
            res.send(arr, { 'Content-type': 'text/json' }, 200);
        }
    });
});

module.exports = router;
