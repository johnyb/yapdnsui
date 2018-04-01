const helpers = {
    WebDriverIO: {
        url: 'http://localhost:3000/',
        host: '172.18.0.1',
        browser: 'chrome',
        desiredCapabilities: {
            browserName: 'chrome',
            chromeOptions: {
                args: ['no-sandbox', 'start-maximized']
            },
            acceptSslCerts: true
        }
    },
    Puppeteer: {
        url: 'http://pdnsui:3000/',
        chrome: {
            args: ['--no-sandbox']
        }
    }
};

module.exports.config = {
    tests: './**/*_spec.js',
    timeout: 10000,
    output: './output',
    helpers: {
        REST: {}
    },
    include: {
        I: './steps_file.js'
    },
    bootstrap: false,
    mocha: {},
    name: 'tests'
};

let backend = process.env.CODECEPT_BACKEND || 'Puppeteer';
if (!helpers[backend]) backend = 'Puppeteer';

module.exports.config.helpers[backend] = helpers[backend];
module.exports.config.helpers.REST.endpoint =
    /localhost/.test(helpers[backend].url) ?
        'http://pdnsui_dev:8080/' : helpers[backend].url;
