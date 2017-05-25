export const ServerAPI = {
    getServers: () => fetch('/endpoints', {
        headers: {
            'Accept': 'application/json'
        }
    }).then((response) => response.json()),

    storeServer: function storeServer(server) {
        let url = '/endpoints',
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

    deleteServer: (server) => fetch(`/endpoints/${server.id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
};

export default ServerAPI;
