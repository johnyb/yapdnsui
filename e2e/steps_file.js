
'use strict';
// in this file you can append custom step methods to 'I' object

const lib = {
    server({ url, password }) {
        const I = this;
        I.amOnPage('/');
        I.click('PDNS Servers');
        I.click('Configure …');
        I.click('Add server');

        I.fillField('URL', url);
        I.fillField('API-Key', password);
        I.click('Add Server');

        const name = url.replace(/^http:\/\//, '');
        I.waitForText(name);
    }
};

module.exports = function() {
    return actor({
        have(type, options) {
            lib[type].call(this, options);
        }
    });
};
