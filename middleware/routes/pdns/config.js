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
/* GET configuration page. */
router.get('/servers/:id/configuration', function (req, res) {
    if (/text\/html/.test(req.headers.accept)) {
        res.location('/');
        res.sendFile('index.html', {
            root: path.join(__dirname, '../../../public/')
        });
        return;
    }

    req.api.config.list().then((result) => {
        res.status(result.statusCode).send(result.config);
    }).then(null, (error) => {
        res.send({ msg: error });
    });
});

module.exports = router;
