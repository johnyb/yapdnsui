import Vue from 'vue';

import MenuList from 'templates/server/menu-list.vue';

Vue.component('menu-server-list', {
    render: function (h) {
        return h(MenuList);
    }
});

import ServerListTemplate from 'templates/server/list.vue';

export let ServerList = Vue.component('server-list', {
    render: h => h(ServerListTemplate)
});

export default ServerList;
