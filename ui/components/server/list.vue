<template>
<div class="container-fluid">
    <div class="page-header">
        <h2>Servers</h2>
        <b-button-toolbar key-nav class="pull-right">
            <icon-button v-b-modal="'server-edit'" @click="setActive({ isNew: true })" icon="plus">
                &nbsp;Add server
            </icon-button>
        </b-button-toolbar>
    </div>
    <server-edit-modal :server="activeItem" />
    <b-table striped condensed hover id="servers-table" width="100%" name="servers-table" :items="servers" :fields="fields">
        <template slot="name" scope="row">
            <b-link :to="`/servers/${row.item.id}/zones`">{{row.item.name}}</b-link>
        </template>
        <template slot="actions" scope="row">
            <b-button-toolbar key-nav>
                <icon-button size="sm" v-b-modal="'server-edit'" @click="setActive(row.item)" iconLabel="Edit Server" icon="pencil-square-o" />
                <icon-button variant="danger" size="sm" @click="remove(row.item)" icon="trash" iconLabel="Remove Server" />
            </b-button-toolbar>
        </template>
    </b-table>
</div>
</template>

<script>
import 'vue-awesome/icons/trash';
import 'vue-awesome/icons/pencil-square-o';

import IconButton from '../icon-button.vue';

import Edit from './edit.vue';
import { mapGetters } from 'vuex';

export default {
    name: 'server-list',
    computed: mapGetters({
        servers: 'getServers'
    }),
    data: function () {
        return {
            fields: {
                name: {
                    label: 'Name'
                },
                url: {
                    label: 'URL'
                },
                daemon_type: {
                    label: 'Daemon Type'
                },
                version: {
                    label: 'Version'
                },
                actions: {}
            },
            activeItem: { isNew: true }
        };
    },
    methods: {
        add: function () {

        },
        remove: function (server) {
            this.$store.dispatch('deleteServer', server);
        },
        setActive: function (server) {
            this.activeItem = server;
        }
    },
    components: {
        'server-edit-modal': Edit,
        'icon-button': IconButton
    }
};
</script>

<style lang="scss">
.page-header {
    padding: 2rem 0;
    h2 {
        display: inline;
    }
    & > .btn-toolbar {
        float: right;
    }
}
</style>
