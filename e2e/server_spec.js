/// <reference path="./steps.d.ts" />

Feature('API endpoints');

Scenario('add a server', (I) => {
    I.amOnPage('/');
    I.click('PDNS Servers');
    I.click('Configure …');
    I.click('Add server');

    I.fillField('URL', 'http://pdns:8081');
    I.fillField('API-Key', 'mimimi');
    I.click('Add Server');

    I.waitForText('pdns:8081');

    I.see('pdns:8081', '#servers-table');
});

Scenario('remove a server', (I) => {
    I.amOnPage('/');
    I.click('PDNS Servers');
    I.click('Configure …');
    I.see('pdns:8081', '#servers-table');
    I.click('#servers-table tr:nth-child(1) button > [aria-label="Remove Server"]');
    I.dontSee('pdns:8081', '#servers-table');
});
