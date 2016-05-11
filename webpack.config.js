'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: ['bootstrap-loader', 'javascripts/main.js']
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
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        })
        //new webpack.optimize.UglifyJsPlugin()
    ],
    devtool: '#source-map',
    module: {
        loaders: [{
            test: /\.jade$/,
            loader: 'jade-loader'
        },
        { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
        { test: /\.(ttf|eot)$/, loader: 'file' },
        {
            test: /\.css$/,
            loaders: [
                'style',
                'css?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]',
                'postcss'
            ]
        },
        {
            test: /\.scss$/,
            loaders: [
                'style',
                'css?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
                'postcss',
                'sass'
            ]
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
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
        }],
        preLoaders: [{
            test: /\.js$/,
            loaders: ['eslint-loader'],
            exclude: /node_modules/
        }]
    }
};
