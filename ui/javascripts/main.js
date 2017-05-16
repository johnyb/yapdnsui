'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';
import About from 'templates/about.vue';
import { ServerList } from './server';
import { ZonesList, ZonesMenu, ZonesEdit } from './zones';
import Bootstrap from 'bootstrap-vue';
import './icons';

Vue.use(VueRouter);
Vue.use(Bootstrap);

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
    }
];

const router = new VueRouter({
    routes
});

import App from 'templates/app.vue';

new Vue({
    el: 'app',
    router,
    render: h => h(App)
});
