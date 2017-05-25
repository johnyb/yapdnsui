const pkg = require('../package.json');
const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// Load our routes
const pdns = require('./routes/pdns');
const servers = require('./routes/servers');

// Initiliaze the app
const app = express();

// Set global package.json details for use in the webgui
app.set('package', pkg);
app.set('title', 'Yet Another PDNS UI');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, '../public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// Add my own public content
app.use(express['static'](path.join(__dirname, '../static')));

app.use('/endpoints', servers);
app.use('/endpoints', pdns.api);

if (process.env.NODE_ENV === 'production') {
    /// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

module.exports = app;
