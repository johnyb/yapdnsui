import Vue from 'vue';

import ZonesListView from 'templates/zones/list.vue';
export let ZonesList = Vue.component('zones-list', {
    render: (h) => h(ZonesListView)
});

import ZonesMenuView from 'templates/zones/menu.vue';
export let ZonesMenu = Vue.component('zones-menu', {
    render: (h) => h(ZonesMenuView)
});

import ZonesEditView from 'templates/zones/edit.vue';
export let ZonesEdit = Vue.component('zones-edit', {
    render: (h) => h(ZonesEditView)
});
