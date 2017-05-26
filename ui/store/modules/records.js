import { RecordsAPI } from '../../api/pdns';

const defaultRecord = {
    isNew: true,
    record: { content: '', disabled: false },
    records: [{ content: '', disabled: false }]
};

const state = {
    records: [],
    activeRecord: JSON.parse(JSON.stringify(defaultRecord))
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
        if (record.isNew) commit('INSERT_RECORD');
        commit('SYNC_ACTIVE_RECORD');
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

function flattenRRsets(rrsets) {
    if (!rrsets.map) return rrsets;
    return rrsets
        .map(set => set.records.map((record, recordIndex) => Object.assign({ record, recordIndex }, set)))
        .reduce((acc, arr) => acc.concat(arr), []);
}

const mutations = {
    RECEIVED_ZONE(state, { zone }) {
        state.records = flattenRRsets(zone.rrsets);
    },
    RECORD_STORED() {},
    RECORD_STORE_FAILURE() {},
    RECORD_REMOVED(state, { record }) {
        state.records = state.records.filter(r => (
            r.name !== record.name ||
            r.type !== record.type ||
            r.recordIndex !== record.recordIndex
        ));
    },
    ACTIVATED_RECORD(state, { record }) {
        state.activeRecord = JSON.parse(JSON.stringify(record || defaultRecord));
    },
    SYNC_ACTIVE_RECORD(state) {
        const active = state.activeRecord;
        active.records.splice(active.recordIndex, 1, active.record);
        state.records.forEach((r, i) => {
            if (r.name !== active.name ||
                r.type !== active.type) return;

            if (r.recordIndex === active.recordIndex) {
                // do not directly assign new value (https://vuejs.org/v2/guide/list.html#Caveats)
                state.records.splice(i, 1, active);
            }
        });
    },
    INSERT_RECORD(state) {
        const active = state.activeRecord;
        let index = state.records.length;
        state.records.forEach((r, i) => {
            if (r.name !== active.name ||
                r.type !== active.type) return;

            index = i + 1;
            active.recordIndex = r.recordIndex + 1;
            active.records = r.records;
        });
        state.records.splice(index, 0, active);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
