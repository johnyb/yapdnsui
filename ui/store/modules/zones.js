import { ZonesAPI } from '../../api/pdns';

const state = {
    zones: []
};

const getters = {
    getZones: function (s) {
        return s.zones;
    }
};

const actions = {
    getZones({ commit }, serverId) {
        ZonesAPI
            .getZones(serverId)
            .then(zones => commit('RECEIVED_ZONES', { zones }));
    },
    deleteZone({ commit }, { serverId, zoneId }) {
        ZonesAPI
            .deleteZone(serverId, zoneId)
            .then(() => commit('ZONE_REMOVED', { zoneId }), () => commit('ZONE_DELETE_FAILURE'));
    }

};

const mutations = {
    RECEIVED_ZONES(st, { zones }) {
        st.zones = zones;
    },
    ZONE_REMOVED(st, { zoneId }) {
        st.zones = st.zones.filter(z => z.id !== zoneId);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
