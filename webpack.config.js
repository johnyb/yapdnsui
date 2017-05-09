'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        main: ['bootstrap-loader', 'stylesheets/main.scss', 'javascripts/main.js']
    },
    output: {
        path: __dirname + '/public/',
        filename: '[name].js'
    },
    resolve: {
        modules: [
            path.resolve('./ui/'),
            path.resolve('./node_modules/jquery/dist/'),
            path.resolve('./node_modules/underscore/'),
            path.resolve('./node_modules/backbone/'),
            path.resolve('./node_modules/backbone.marionette/lib/'),
            path.resolve('./node_modules')
        ],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery'
        })
        //new webpack.optimize.UglifyJsPlugin()
    ],
    devtool: '#source-map',
    module: {
        rules: [{
            test: /\.jade$/,
            loader: 'jade-loader'
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.(woff2?|svg)$/,
            use: [{
                loader: 'url-loader',
                options: { limit: 10000 }
            }]
        }, { test: /\.(ttf|eot)$/, loader: 'file-loader' },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2017'],
                    plugins: [require('babel-plugin-system-import-transformer')]
                }
            }]
        }, {
            test: /backbone\.marionette\.js/,
            use: [{
                loader: 'imports-loader',
                options: {
                    _: 'underscore',
                    Backbone: 'backbone'
                }
            }]
        }, {
            test: /\.js$/,
            loader: 'eslint-loader',
            enforce: 'pre',
            exclude: /node_modules/
        }]
    }
};
