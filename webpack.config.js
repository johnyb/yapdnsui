'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: 'javascripts/main.js'
    },
    output: {
        path: __dirname + '/public/',
        filename: '[name].js'
    },
    resolve: {
        root: [
            path.resolve('./ui/'),
            path.resolve('./node_modules/jquery/dist/'),
            path.resolve('./node_modules/underscore/'),
            path.resolve('./node_modules/backbone/'),
            path.resolve('./node_modules/backbone.marionette/lib/')
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    devtool: '#source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
        }, {
            test: /backbone\.marionette\.js/,
            loader: 'imports-loader',
            query: {
                _: 'underscore',
                Backbone: 'backbone'
            }
        }, {
            test: /backbone\.marionette\.js/,
            loader: 'exports-loader',
            query: 'Marionette'
        }],
        preLoaders: [{
            test: /\.js$/,
            loaders: ['eslint-loader'],
            exclude: /node_modules/
        }]
    }
};
