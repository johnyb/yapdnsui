export const ZonesAPI = {
    getZones: (server) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '')}`, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json()),
    deleteZone: (server, zoneId) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '/' + zoneId)}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    }),
    update: (server, zone) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '/' + zone.id)}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(zone)
    }).then(r => new Promise((resolve, reject) => {
        r.status >= 400 ? r.json().then(reject) : r.json().then(resolve);
    })),
    create: (server, zone) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '')}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(zone)
    }).then(r => new Promise((resolve, reject) => {
        r.status >= 400 ? r.json().then(reject) : r.json().then(resolve);
    })),
    check: (server, zone) => fetch(`/endpoints/${server.id}${zone.url}/check`, {
        headers: {
            'accept': 'application/json'
        }
    }).then(r => new Promise((resolve, reject) => {
        r.status >= 400 ? r.json().then(reject) : r.json().then(resolve);
    })),
    retrieve: (server, zone) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '/' + zone.id)}/axfr-retrieve`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json()),
    notify: (server, zone) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '/' + zone.id)}/notify`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json())
};

export const RecordsAPI = {
    getRecords: (server, zone) => fetch(`/endpoints/${server.id}${zone.url}`, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json()),
    update: (server, zone, record) => fetch(`/endpoints/${server.id}${zone.url}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rrsets: [{
                name: record.name,
                type: record.type,
                ttl: record.ttl,
                changetype: 'replace',
                records: record.records
            }]
        })
    }).then(res => res.json())
    .catch(() => record),
    deleteRecord: (server, zone, record) => fetch(`/endpoints/${server.id}${zone.url}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rrsets: [{
                name: record.name,
                type: record.type,
                ttl: record.ttl,
                changetype: record.records.length === 1 ? 'delete' : 'replace',
                records: record.records.filter((r, i) => i !== record.recordIndex)
            }]
        })
    })
};
