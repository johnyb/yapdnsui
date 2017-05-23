<template>
<div class="container-fluid">
    <div class="page-header">
        <h2>Servers</h2>
        <b-button-toolbar key-nav class="pull-right">
            <b-button v-b-modal="'server-edit'" @click="setActive({ isNew: true })">
                Add server
            </b-button>
            <b-button v-on:click="refresh">
                <icon label="Refresh list" name="refresh" />
            </b-button>
        </b-button-toolbar>
    </div>
    <server-edit-modal :server="activeItem" />
    <b-table striped condensed hover id="servers-table" width="100%" name="servers-table" :items="servers" :fields="fields">
        <template slot="name" scope="row">
            <b-link :to="`servers/${row.item.id}/zones`">{{row.item.name}}</b-link>
        </template>
        <template slot="actions" scope="row">
            <b-button-toolbar key-nav>
                <b-button size="sm" v-b-modal="'server-edit'" @click="setActive(row.item)"><icon label="Edit Server" name="pencil-square-o" /></b-button>
                <b-button variant="danger" size="sm" @click="remove(row.item)"><icon name="trash" label="Remove Server" /></b-button>
            </b-button-toolbar>
        </template>
    </b-table>
</div>
</template>

<script>
import 'vue-awesome/icons/refresh';
import 'vue-awesome/icons/trash';
import 'vue-awesome/icons/pencil-square-o';

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
                pdns_daemon_type: {
                    label: 'Daemon Type'
                },
                pdns_version: {
                    label: 'Version'
                },
                actions: {}
            },
            activeItem: { isNew: true }
        };
    },
    methods: {
        refresh: function () {
            this.$store.dispatch('getServers');
        },
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
        'server-edit-modal': Edit
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
