var fs = require('fs');
var file = 'yapdnsui.sqlite3';
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var url = require('url');

if (!exists) {
    console.log('Creating DB File');
    fs.openSync(file, 'w');
}

// Create internal DB for the server list in memory
exports.create = function () {
    var db = new sqlite3.Database(file);
    // Initiliaze the db
    db.serialize(function () {
        if (!exists) {
            db.run('CREATE TABLE servers (id integer primary key asc, name TEXT, url TEXT, password TEXT, pdns_type TEXT, pdns_id TEXT, pdns_url TEXT, pdns_daemon_type TEXT, pdns_version TEXT, pdns_config_url TEXT, pdns_zones_url TEXT)');
            db.run('INSERT INTO servers VALUES (?,?,?,?,?,?,?,?,?,?,?)', [null, 'pdns', 'http://pdns:8081/api/v1', 'mimimi', null, null, null, null, null, null, null]);
            db.each('SELECT * FROM servers', function (err, row) {
                console.log('init db.js', row);
            });
        }
    });
    return db;
};

// Initiliaze the db
var db = exports.create();

exports.list = function () {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM servers', (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

exports.add = function (obj) {
    return new Promise((resolve, reject) => {
        let parsedUrl = url.parse(obj.url);
        db.run('INSERT INTO servers VALUES (?,?,?,?,?,?,?,?,?,?,?)', [null, parsedUrl.host, obj.url, obj.password, null, null, null, null, null, null, null], function (err) {
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

exports.refresh = function (id, pdns) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE servers SET pdns_type=?, pdns_id=?, pdns_url=?, pdns_daemon_type=?, pdns_version=?, pdns_config_url=?, pdns_zones_url=? WHERE id=?', [pdns.type, pdns.id, pdns.url, pdns.daemon_type, pdns.version, pdns.config_url, pdns.zones_url, id], (err, row) => {
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
