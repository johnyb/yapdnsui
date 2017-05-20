import Vue from 'vue';
import VueRouter from 'vue-router';
import Bootstrap from 'bootstrap-vue';

Vue.use(VueRouter);
Vue.use(Bootstrap);

import About from 'components/about.vue';

import MenuList from 'components/server/menu-list.vue';
Vue.component('menu-server-list', {
    render: function (h) {
        return h(MenuList);
    }
});

import ServerListTemplate from 'components/server/list.vue';
const ServerList = Vue.component('server-list', {
    render: h => h(ServerListTemplate)
});

import ZonesListView from 'components/zones/list.vue';
const ZonesList = Vue.component('zones-list', {
    render: (h) => h(ZonesListView)
});

import ZonesMenuView from 'components/zones/menu.vue';
const ZonesMenu = Vue.component('zones-menu', {
    render: (h) => h(ZonesMenuView)
});

import ZonesEditView from 'components/zones/edit.vue';
const ZonesEdit = Vue.component('zones-edit', {
    render: (h) => h(ZonesEditView)
});

import RecordsListView from 'components/records/list.vue';
const RecordsList = Vue.component('records-list', {
    render: h => h(RecordsListView)
});

import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);

const routes = [
    { path: '/', component: About },
    { path: '/about', component: About },
    { path: '/servers', component: ServerList },
    {
        path: '/servers/:serverId/zones',
        components: {
            default: ZonesList,
            mainMenu: ZonesMenu
        }
    },
    {
        path: '/servers/:serverId/config',
        components: {
            default: null,
            mainMenu: ZonesMenu
        }
    },
    {
        path: '/servers/:serverId/stats',
        components: {
            default: null,
            mainMenu: ZonesMenu
        }
    },
    {
        path: '/servers/:serverId/zones/edit/:zoneId?',
        components: {
            default: ZonesEdit,
            mainMenu: ZonesMenu
        }
    },
    {
        path: '/servers/:serverId/zones/:zoneId',
        components: {
            default: RecordsList,
            mainMenu: ZonesMenu
        }
    }
];

const router = new VueRouter({
    routes
});

import store from 'store';
import App from 'components/app.vue';

new Vue({
    el: 'app',
    router,
    store,
    render: h => h(App)
});
