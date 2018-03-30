/// <reference path="./../steps.d.ts" />

Feature('Zones on authoritive servers');

Scenario('add a master zone', (I) => {
    I.addServer({
        url: 'http://pdns:8081',
        password: 'mimimi'
    });
    I.wait(0.5);
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

Scenario('remove zones', async (I) => {
    I.amOnPage('/#/servers');
    I.click('pdns:8081', '#servers-table');

    I.click('#zones-table .btn-toolbar[data-zone="yapdnsui.test."] button > [aria-label="Remove Zone"]');
    I.waitForText('Delete zone');
    //TODO: may be, get rid of this hard-coded timeout
    I.wait(0.5);
    I.click('Delete zone');
});

Scenario('remove all servers', async (I) => {
    I.amOnPage('/#/servers');

    const servers = await I.grabNumberOfVisibleElements('#servers-table tbody tr');
    for (let i = 0; i < servers; i++) {
        I.click('#servers-table tr:nth-child(1) button > [aria-label="Remove Server"]');
    }
    I.dontSeeElementInDOM('#servers-table tbody tr');
});
