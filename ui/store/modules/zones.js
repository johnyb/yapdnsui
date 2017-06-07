import { ZonesAPI } from '../../api/pdns';

const state = {
    zones: [],
    activeZone: {},
    lastError: ''
};

const getters = {
    getZones: function (s) {
        return s.zones;
    },
    activeZone: state => state.activeZone,
    lastError: state => state.lastError
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
        return request(rootGetters.activeServer, zone)
            .then(
                (newZone) => commit('ZONE_UPDATED', { zone, newZone }) || true,
                (result) => commit('ZONE_UPDATE_ERROR', { zone, result })
            );
    },
    deleteZone({ rootGetters, commit }, { zoneId }) {
        return ZonesAPI
            .deleteZone(rootGetters.activeServer, zoneId)
            .then(() => commit('ZONE_REMOVED', { zoneId }), () => commit('ZONE_DELETE_FAILURE'));
    },
    verifyZone({ rootGetters, getters, commit }) {
        return ZonesAPI.check(rootGetters.activeServer, getters.activeZone)
            .then(checkResults => commit('ZONE_CHECK', checkResults), error => commit('ZONE_CHECK_ERROR', { error }));
    },
    retrieveZone({ rootGetters, getters, commit }) {
        return ZonesAPI.retrieve(rootGetters.activeServer, getters.activeZone)
            .then(retrieveResults => commit('ZONE_RETRIEVED', retrieveResults), error => commit('ZONE_RETRIEVE_ERROR', { error }));
    },
    notifyZone({ rootGetters, getters, commit }) {
        return ZonesAPI.notify(rootGetters.activeServer, getters.activeZone)
            .then(
                notifyResults => commit('ZONE_NOTIFIED', notifyResults),
                error => commit('ZONE_NOTIFY_ERROR', { error })
            );
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
    ZONE_UPDATE_ERROR(state, { result }) {
        state.lastError = result.error;
    },
    ACTIVATED_ZONE(state, { zoneId }) {
        state.activeZone = state.zones.filter(z => z.id === zoneId)[0] || zoneId;
    },
    ZONE_CHECK(state, { checkResults }) {
        state.activeZone.check = checkResults;
    },
    ZONE_CHECK_ERROR(state, { error }) {
        // will always land here, since /check is not implemented, yet
        state.lastError = error;
    },
    ZONE_NOTIFIED(state) {
        state.activeZone.notified = true;
    },
    ZONE_RETRIEVED(state) {
        state.activeZone.retrieved = true;
    },
    updateZone(state, update) {
        for (const key in update) {
            state.activeZone[key] = update[key];
        }
    },
    clearError(state) {
        state.lastError = '';
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
