import { RecordsAPI } from '../../api/pdns';

const state = {
    records: [],
    activeRecord: {}
};

const getters = {
    records: state => state.records,
    activeRecord: state => state.activeRecord
};

const actions = {
    setActiveRecord({ commit }, record) {
        commit('ACTIVATED_RECORD', { record });
    },
    getRecords({ rootGetters, commit }) {
        if (!rootGetters.activeServer.id || !rootGetters.activeZone.url) return;
        return RecordsAPI
            .getRecords(rootGetters.activeServer, rootGetters.activeZone)
            .then(zone => commit('RECEIVED_ZONE', { zone }));
    },
    updateRecord({ rootGetters, getters, commit }) {
        const record = getters.activeRecord;
        RecordsAPI
            .update(rootGetters.activeServer, rootGetters.activeZone, record)
            .then(() => commit('RECORD_STORED', { record }), () => commit('RECORD_STORE_FAILURE'));
    },
    deleteRecord({ rootGetters, getters, commit }) {
        RecordsAPI
            .deleteRecord(rootGetters.activeServer, rootGetters.activeZone, getters.activeRecord)
            .then(() => commit('RECORD_REMOVED', { record: getters.activeRecord }), () => commit('RECORD_DELETE_FAILURE'));
    }

};

const mutations = {
    RECEIVED_ZONE(state, { zone }) {
        state.records = zone.rrsets;
    },
    RECORD_STORED(state, { record }) {
        let index = state.records.length;
        state.records.forEach((r, i) => {
            if (r.name === record.name && r.type === record.type) index = i;
        });
        state.records[index] = record;
    },
    RECORD_STORE_FAILURE() {},
    RECORD_REMOVED(state, { record }) {
        state.records = state.records.filter(r => r.name !== record.name || r.type !== record.type);
    },
    ACTIVATED_RECORD(state, { record }) {
        state.activeRecord = state.records.filter(r => r.name === record.name && r.type === record.type)[0] || record;
    },
    updateRecord(state, record) {
        for (const key in record) {
            let obj = state.activeRecord;
            key.split('.').forEach((k, i, ks) => {
                if (i === ks.length - 1) {
                    obj[k] = record[key];
                } else {
                    obj = obj[k];
                }
            });
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
