export const ZonesAPI = {
    getZones: (serverId) => fetch(`/servers/${serverId}/zones`, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => res.json()),
    deleteZone: (serverId, zoneId) => fetch(`/servers/${serverId}/zones/${zoneId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
};
