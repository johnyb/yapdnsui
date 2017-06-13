const fs = require('fs');
const file = 'yapdnsui.sqlite3';
const exists = fs.existsSync(file);

const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const request = require('request');

if (!exists) {
    fs.openSync(file, 'w');
}

// Create internal DB for the server list in memory
exports.create = function () {
    const db = new sqlite3.Database(file);
    // Initiliaze the db
    db.serialize(function () {
        if (!exists) {
            db.run('CREATE TABLE servers (id integer primary key asc, name TEXT, url TEXT, password TEXT)');
            db.run('INSERT INTO servers VALUES (?,?,?,?)', [null, 'pdns', 'http://pdns:8081/', 'mimimi']);
            db.each('SELECT * FROM servers');
        }
    });
    return db;
};

// Initiliaze the db
const db = exports.create();

exports.list = function () {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM servers', (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    }).then(function (rows) {
        return Promise.all(rows.map(function (server) {
            return new Promise((resolve) => {
                request({
                    url: `${server.url}api/v1/servers/localhost`,
                    headers: {
                        'X-API-Key': server.password,
                        accept: 'application/json'
                    }
                }, function (err, res) {
                    if (err) return resolve({});
                    resolve(Object.assign(JSON.parse(res.body), server));
                });
            });
        })).then(ress => ress.reduce(
            (acc, res) => Object.keys(res).length ? acc.concat(res) : acc,
            []
        ));
    });
};

exports.add = function (obj) {
    return new Promise((resolve, reject) => {
        let parsedUrl = url.parse(obj.url);
        db.run('INSERT INTO servers VALUES (?,?,?,?)', [null, parsedUrl.host, obj.url, obj.password], function (err) {
            if (err) return reject(err);
            return resolve(this.lastID);
        });
    });
};

exports.update = function (id, body) {
    return new Promise((resolve, reject) => {
        let obj = url.parse(body.url);
        db.run('UPDATE servers SET name=?,url=?,password=? WHERE id=?', [obj.host, body.url, body.password, id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

exports.getServer = function (id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM servers WHERE id=? LIMIT 1', [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

exports['delete'] = function (id) {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM servers WHERE id=?', [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};
