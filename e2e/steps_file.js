async function getEndpoint(I, endpoint) {
    const { body } = await I.sendGetRequest('endpoints');
    const { id } = body.filter(e => e.name === endpoint)[0];
    return `endpoints/${id}`;
}
const createLib = {
    server({ url, password }) {
        return this.sendPostRequest('endpoints', { url, password }, { 'Content-Type': 'application/json' });
    },
    async zone({ endpoint, zone }) {
        return this.sendPostRequest(
            `${await getEndpoint(this, endpoint)}/api/v1/servers/localhost/zones`,
            zone,
            { 'Content-Type': 'application/json' }
        );
    },
    async record({ endpoint, zone, rrsets }) {
        return this.sendPatchRequest(
            `${await getEndpoint(this, endpoint)}/api/v1/servers/localhost/zones/${zone}`,
            { rrsets },
            { 'Content-Type': 'application/json' }
        );
    }
};

const cleanupLib = {
    async server({ endpoint }) {
        return this.sendDeleteRequest(`${await getEndpoint(this, endpoint)}`);
    },
    async zone({ endpoint, zone }) {
        return this.sendDeleteRequest(`${ await getEndpoint(this, endpoint) }/api/v1/servers/localhost/zones/${ zone }`);
    }
};

module.exports = function() {
    return actor({
        have(type, options) {
            return createLib[type].call(this, options);
        },
        cleanup(type, options) {
            return cleanupLib[type].call(this, options);
        }
    });
};
