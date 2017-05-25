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
            'Content-Type': ''
        },
        body: JSON.stringify(zone)
    }).then(res => res.json()),
    create: (server, zone) => fetch(`/endpoints/${server.id}${server.zones_url.replace(/{.*}$/, '')}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(zone)
    }).then(res => res.json())
};

export const RecordsAPI = {
    getRecords: (server, zone) => fetch(`/endpoints/${server.id}/${zone.url}`, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json()),
    update: (server, zone, record) => fetch(`/endpoints/${server.id}/${zone.url}`, {
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
    deleteRecord: (server, zone, record) => fetch(`/endpoints/${server.id}/${zone.url}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rrsets: [{
                name: record.name,
                type: record.type,
                changetype: 'delete',
                records: []
            }]
        })
    })
};
