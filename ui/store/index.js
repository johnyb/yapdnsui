
import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import servers from './modules/servers';
import zones from './modules/zones';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        servers,
        zones
    },
    strict: false,
    plugins: []
});
