import { ServerAPI } from '../../api/yapdns';

const state = {
    servers: []
};

const getters = {
    getServers: s => s.servers
};

const actions = {
    getServers({ commit }) {
        ServerAPI
            .getServers()
            .then(servers => commit('RECEIVED_SERVERS', { servers }));
    },
    storeServer({ commit }, server) {
        ServerAPI
            .storeServer(server)
            .then((response) => server.isNew ? fetch(`/servers/${response.id}`) : response)
            .then(() => commit('SERVER_STORED', { server }), () => commit('SERVER_STORE_FAILURE'));
    },
    deleteServer({ commit }, server) {
        ServerAPI
            .deleteServer(server)
            .then(() => commit('SERVER_REMOVED', { server }), () => commit('SERVER_DELETE_FAILURE'));
    }

};

const mutations = {
    RECEIVED_SERVERS(st, { servers }) {
        st.servers = servers;
    },
    SERVER_STORED(st, { server }) {
        st.servers.push(server);
    },
    SERVER_STORE_FAILURE() {},
    SERVER_REMOVED(st, { server }) {
        st.servers = st.servers.filter(s => s.id !== server.id);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
