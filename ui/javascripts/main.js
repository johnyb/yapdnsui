'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';
import About from 'templates/about.vue';
import { ServerList } from 'javascripts/server';
import Bootstrap from 'bootstrap-vue';
import './icons';

Vue.use(VueRouter);
Vue.use(Bootstrap);

const routes = [
    { path: '/', component: About },
    { path: '/about', component: About },
    { path: '/servers', component: ServerList }
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
