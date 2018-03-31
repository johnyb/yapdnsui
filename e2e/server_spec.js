/// <reference path="./steps.d.ts" />

Feature('API endpoints');

function addServerFn({ url, password }) {
    const I = this;
    I.click('PDNS Servers');
    I.click('Configure …');
    I.click('Add server');

    I.fillField('URL', url);
    I.fillField('API-Key', password);
    I.click('Add Server');

    const name = url.replace(/^http:\/\//, '');
    I.waitForText(name);

    I.see(name, '#servers-table tr td:nth-child(1)');

    return { name, url, password };
}

function removeSelectorFor() {
    //return `#servers-table .btn-toolbar[data-server-name="${ name }"] [aria-label="Remove Server"]`;
    return '#servers-table tr:nth-child(1) button > [aria-label="Remove Server"]';
}

Scenario('add and remove 3 API endpoints of different types', (I) => {
    const addServer = addServerFn.bind(I);
    let name;

    I.amOnPage('/');

    name = addServer({
        url: 'http://pdns:8081',
        password: 'mimimi'
    }).name;
    I.click(removeSelectorFor(name));
    I.dontSee(name, '#servers-table');

    name = addServer({
        url: 'http://pdns_slave:8081',
        password: 'mimimi'
    }).name;
    I.click(removeSelectorFor(name));
    I.dontSee(name, '#servers-table');

    name = addServer({
        url: 'http://pdns_rec:8082',
        password: 'mimimi'
    }).name;
    I.click(removeSelectorFor(name));
    I.dontSee(name, '#servers-table');
});
