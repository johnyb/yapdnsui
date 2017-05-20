export const ServerAPI = {
    getServers: () => fetch('/servers', {
        headers: {
            'Accept': 'application/json'
        }
    }).then((response) => response.json()),

    storeServer: function storeServer(server) {
        let url = '/servers',
            method = 'POST';
        if (server.id) {
            url += `/${server.id}`;
            method = 'PUT';
        }
        return fetch(url, {
            method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(server)
        }).then(response => response.json());
    },

    deleteServer: (server) => fetch(`/servers/${server.id}`, {
        method: 'DELETE'
    })
};

export default ServerAPI;
