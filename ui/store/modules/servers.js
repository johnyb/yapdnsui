import { ServerAPI } from '../../api/yapdns';

const state = {
    servers: [],
    activeServer: {}
};

const getters = {
    getServers: state => state.servers,
    activeServer: state => state.activeServer
};

const actions = {
    setActiveServer({ commit }, serverId) {
        commit('ACTIVATED_SERVER', { serverId });
    },
    getServers({ state, commit }) {
        return ServerAPI
            .getServers()
            .then(servers => commit('RECEIVED_SERVERS', { servers }))
            .then(() => {
                if (typeof state.activeServer === 'number') {
                    commit('ACTIVATED_SERVER', { serverId: state.activeServer });
                }
                return state.servers;
            });
    },
    storeServer({ commit, dispatch }, server) {
        return ServerAPI
            .storeServer(server)
            .then((server) => commit('SERVER_STORED', { server }), () => commit('SERVER_STORE_FAILURE'))
            .then(() => dispatch('getServers'));
    },
    deleteServer({ commit }, server) {
        ServerAPI
            .deleteServer(server)
            .then(() => commit('SERVER_REMOVED', { server }), () => commit('SERVER_DELETE_FAILURE'));
    }

};

const mutations = {
    RECEIVED_SERVERS(state, { servers }) {
        state.servers = servers;

    },
    SERVER_STORED(state, { server }) {
        state.servers.push(server);
    },
    SERVER_STORE_FAILURE() {},
    SERVER_REMOVED(state, { server }) {
        state.servers = state.servers.filter(s => s.id !== server.id);
    },
    ACTIVATED_SERVER(state, { serverId }) {
        state.activeServer = state.servers.filter(s => s.id === Number(serverId))[0] || Number(serverId);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
