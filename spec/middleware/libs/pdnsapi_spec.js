const PDNSAPI = require('../../../middleware/libs/pdnsapi.js');
const expect = require('chai').expect;

describe('PDNSAPI', () => {
    let api = new PDNSAPI(1);
    it('should be a class', () => {
        expect(PDNSAPI).to.be.a('function');
        expect(api).to.be.an('object');
    });

    describe('instance', () => {
        it('should provide a config object', () => {
            expect(api.config).to.be.an('Object');
        });
        it('should provide a zones object', () => {
            expect(api.zones).to.be.an('Object');
        });
        it('should provide a records object', () => {
            expect(api.records).to.be.an('Object');
        });
        it('should provide a stats object', () => {
            expect(api.stats).to.be.an('Object');
        });
    });

    describe('config API', () => {
        it('should have a list function', () => {
            expect(api.config.list).to.be.a('function');
        });
        it('should have a servers function', () => {
            expect(api.config.servers).to.be.a('function');
        });

        it('should provide list of configuration values', () => {
            return api.config.list()
                .then(JSON.parse)
                .then((result) => {
                    expect(result).to.be.an('array');
                });
        });
    });
});
