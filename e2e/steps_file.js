
'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor({
        addServer({ url, password }) {
            const I = this;
            I.amOnPage('/#/servers');
            I.click('Add server');

            I.fillField('URL', url);
            I.fillField('API-Key', password);
            I.click('Add Server');

            const name = url.replace(/^http:\/\//, '');
            I.waitForText(name);

            I.see(name, '#servers-table tr td:nth-child(1)');
        }
    });
};
