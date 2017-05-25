const express = require('express');
const database = require('../../libs/db');
const router = express.Router();
const request = require('request');

router.param('id', function (req, res, next, id) {
    if (parseInt(id, 10) && !/text\/html/.test(req.headers.accept)) {
        database.getServer(id).then((server) => {
            req.server = server;
        }).then(next, next);
    } else {
        next();
    }
});

router.use('/:id/**', function (req, res) {
    const data = {
        dataType: 'json',
        method: req.method,
        url: `${req.server.url}${req.params[0]}`,
        headers: {
            'X-API-Key': req.server.password
        }
    };
    if (req.headers['accept']) data.headers['accept'] = req.headers['accept'];
    if (req.body) {
        data.body = {};
        for (const key in req.body) {
            data.body[key] = req.body[key];
        }
        data.body = JSON.stringify(data.body);
    }
    if (req.headers['content-type']) data.headers['content-type'] = req.headers['content-type'];
    request(data, function (error, response) {
        if (!error) return res.status(response.statusCode).send(response.body);
    });
});

module.exports = router;
