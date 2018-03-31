/// <reference path="./steps.d.ts" />

Feature('API endpoints');

Scenario('add a primary server', (I) => {
    I.amOnPage('/');
    I.click('PDNS Servers');
    I.click('Configure …');
    I.click('Add server');

    I.fillField('URL', 'http://pdns:8081');
    I.fillField('API-Key', 'mimimi');
    I.click('Add Server');

    I.waitForText('pdns:8081');

    I.see('pdns:8081', '#servers-table tr td:nth-child(1)');
});

Scenario('add a secondary server', (I) => {
    I.addServer({
        url: 'http://pdns_slave:8081',
        password: 'mimimi'
    });
});

Scenario('add a recursor server', (I) => {
    I.addServer({
        url: 'http://pdns_rec:8082',
        password: 'mimimi'
    });
});

Scenario('remove all servers', async (I) => {
    I.amOnPage('/#/servers');

    const servers = await I.grabNumberOfVisibleElements('#servers-table tbody tr');
    for (let i = 0; i < servers; i++) {
        I.click('#servers-table tr:nth-child(1) button > [aria-label="Remove Server"]');
    }
    I.wait(0.1);
    I.dontSeeElementInDOM('#servers-table tbody tr');
});
