const PDNSAPI = require('../../../middleware/libs/pdnsapi.js');
const expect = require('chai').expect;

describe('PDNSAPI', () => {
    it('should be a class', () => {
        expect(PDNSAPI).to.be.a('function');
        let api = new PDNSAPI();
        expect(api).to.be.an('object');
    });

    describe('instance', () => {
        let api = new PDNSAPI(1);

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
});
