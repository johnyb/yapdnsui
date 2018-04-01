/// <reference path="./../steps.d.ts" />

Feature('Zones on authoritive servers');

BeforeSuite((I) => {
    return Promise.all([
        I.have('server', {
            url: 'http://pdns:8081',
            password: 'mimimi'
        }),
        I.have('server', {
            url: 'http://pdns_slave:8081',
            password: 'mimimi'
        })
    ]);
});

Scenario('add a master zone', (I) => {
    I.amOnPage('/');

    I.click('PDNS Servers');
    I.click('pdns:8081', '.dropdown-menu.show');
    I.see('zones in pdns:8081');

    I.click('Create zone');
    I.see('Add zone');
    I.fillField('Zone/Domain name', 'yapdnsui.test');

    I.dontSee('Nameservers', 'label');

    I.checkOption('Master');

    I.see('Nameservers', 'label');
    I.fillField('Nameservers', 'ns.yapdnsui.test,ns2.yapdnsui.test.');

    I.click('Add zone');
    I.see('is not canonical', '.alert-danger');

    I.fillField('Zone/Domain name', 'yapdnsui.test.');
    I.click('Add zone');
    I.see('Nameserver is not canonical', '.alert-danger');

    I.fillField('Nameservers', 'ns.yapdnsui.test.,ns2.yapdnsui.test.');
    I.click('Add zone');
    I.see('zones in pdns:8081');
});

const util = require('util');
const dns = require('dns');
const lookup = util.promisify(dns.lookup);

Scenario('add slave zone', async (I) => {
    I.amOnPage('/');

    I.click('PDNS Servers');
    I.click('pdns_slave:8081', '.dropdown-menu.show');
    I.see('zones in pdns_slave:8081');

    I.click('Create zone');
    I.see('Add zone');
    I.fillField('Zone/Domain name', 'yapdnsui.test.');

    I.dontSee('Zone master', 'label');

    I.checkOption('Slave');

    const masterIP = await lookup('pdns');
    I.see('Zone master', 'label');
    I.fillField('Zone master', masterIP.address);

    I.click('Add zone');
    I.see('zones in pdns_slave:8081');
});

Scenario('remove zones', (I) => {
    I.amOnPage('/#/servers');
    I.click('pdns:8081', '#servers-table');

    I.click('#zones-table .btn-toolbar[data-zone="yapdnsui.test."] button > [aria-label="Remove Zone"]');
    I.waitForText('Delete zone');
    //TODO: may be, get rid of this hard-coded timeout
    I.wait(0.5);
    I.click('Delete zone');

    I.wait(0.5);

    I.click('PDNS Servers');
    I.wait(0.5);
    I.click('pdns_slave:8081', '.dropdown-menu.show');

    I.click('#zones-table .btn-toolbar[data-zone="yapdnsui.test."] button > [aria-label="Remove Zone"]');
    I.waitForText('Delete zone');
    //TODO: may be, get rid of this hard-coded timeout
    I.wait(0.5);
    I.click('Delete zone');
});

AfterSuite((I) => {
    return Promise.all([
        I.cleanup('server', { endpoint: 'pdns:8081' }),
        I.cleanup('server', { endpoint: 'pdns_slave:8081' })
    ]);
});
