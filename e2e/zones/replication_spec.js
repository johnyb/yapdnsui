const util = require('util');
const dns = require('dns');
const lookup = util.promisify(dns.lookup);

/// <reference path="./../steps.d.ts" />

Feature('Zone replication on authoritive servers');

BeforeSuite(async (I) => {
    await Promise.all([
        I.have('server', {
            url: 'http://pdns:8081',
            password: 'mimimi'
        }),
        I.have('server', {
            url: 'http://pdns_slave:8081',
            password: 'mimimi'
        })
    ]);
    const masterIP = await lookup('pdns');
    await Promise.all([
        I.have('zone', {
            endpoint: 'pdns:8081',
            zone: {
                name: 'yapdnsui.test.',
                kind: 'Master',
                nameservers: ['ns.yapdnsui.test.', 'ns2.yapdnsui.test.']
            }
        }),
        I.have('zone', {
            endpoint: 'pdns_slave:8081',
            zone: {
                name: 'yapdnsui.test.',
                kind: 'Slave',
                masters: [masterIP.address]
            }
        })
    ]);
});

Scenario('', async (I) => {
    I.amOnPage('/');
    I.click('PDNS Servers');
    I.click('pdns:8081');
    I.click('yapdnsui.test.', '#zones-table');

    await I.have('record', { endpoint: 'pdns:8081', zone: 'yapdnsui.test.', rrsets: [{
        changetype: 'replace',
        name: 'www.yapdnsui.test.',
        records: [{content: '1.2.3.4', disabled: false}],
        ttl: '86400',
        type: 'A'
    }]});

    I.refreshPage();

    I.see('www', '#records-table');
    I.see('1.2.3.4', '#records-table');

    I.click('PDNS Servers');
    I.click('pdns_slave:8081');
    I.click('yapdnsui.test.', '#zones-table');

    I.dontSee('www', '#records-table');
    I.dontSee('1.2.3.4', '#records-table');

    I.click('Zones', '.navbar');

    I.click('#zones-table .btn-toolbar[data-zone="yapdnsui.test."] [aria-label="Retrieve zone from master"]');

    I.click('yapdnsui.test.', '#zones-table');

    I.see('www', '#records-table');
    I.see('1.2.3.4', '#records-table');
});

AfterSuite((I) => {
    return Promise.all([
        I.cleanup('zone', { endpoint: 'pdns:8081', zone: 'yapdnsui.test.' }),
        I.cleanup('zone', { endpoint: 'pdns_slave:8081', zone: 'yapdnsui.test.' }),
        I.cleanup('server', { endpoint: 'pdns:8081' }),
        I.cleanup('server', { endpoint: 'pdns_slave:8081' })
    ]);
});
