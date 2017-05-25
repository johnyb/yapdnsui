import { ZonesAPI } from '../../api/pdns';

const state = {
    zones: [],
    activeZone: {}
};

const getters = {
    getZones: function (s) {
        return s.zones;
    },
    activeZone: state => state.activeZone
};

const actions = {
    getZones({ rootGetters, commit }) {
        if (!rootGetters.activeServer.id) return;
        return ZonesAPI
            .getZones(rootGetters.activeServer)
            .then(zones => commit('RECEIVED_ZONES', { zones }))
            .then((zones) => {
                if (typeof state.activeZone === 'string') commit('ACTIVATED_ZONE', { zoneId: state.activeZone });
                return zones;
            });
    },
    setActiveZone({ commit }, zoneId) {
        commit('ACTIVATED_ZONE', { zoneId });
    },
    updateZone({ rootGetters, getters, commit }, event) {
        event.preventDefault();
        const zone = getters.activeZone;
        const request = zone.id ? ZonesAPI.update : ZonesAPI.create;
        request(rootGetters.activeServer, zone)
            .then((newZone) => commit('ZONE_UPDATED', { zone, newZone }));
    },
    deleteZone({ rootGetters, commit }, { zoneId }) {
        ZonesAPI
            .deleteZone(rootGetters.activeServer, zoneId)
            .then(() => commit('ZONE_REMOVED', { zoneId }), () => commit('ZONE_DELETE_FAILURE'));
    }

};

const mutations = {
    RECEIVED_ZONES(state, { zones }) {
        state.zones = zones;
    },
    ZONE_REMOVED(state, { zoneId }) {
        state.zones = state.zones.filter(z => z.id !== zoneId);
    },
    ZONE_UPDATED(state, { zone, newZone }) {
        state.zones = state.zones.filter(z => z.id !== zone.id);
        state.zones.push(newZone);
    },
    ACTIVATED_ZONE(state, { zoneId }) {
        state.activeZone = state.zones.filter(z => z.id === zoneId)[0] || zoneId;
    },
    updateZone(state, update) {
        for (const key in update) {
            state.activeZone[key] = update[key];
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
