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
                <b-button variant="danger" size="sm" @click="remove(row.item.id)"><icon name="trash" label="Remove Server" /></b-button>
            </b-button-toolbar>
        </template>
    </b-table>
</div>
</template>

<script>
import 'vue-awesome/icons/refresh';
import 'vue-awesome/icons/trash';
import 'vue-awesome/icons/pencil-square-o'

import Edit from './edit.vue';

import { servers } from 'store/index';

export default {
    name: 'server-list',
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
            servers,
            activeItem: { isNew: true }
        };
    },
    methods: {
        refresh: function () {
            Promise.all(this.servers.map(s => fetch(`/servers/${s.id}`).then(res => res.json())))
            .then(() => fetch('/servers').then(res => res.json()))
            .then((data) => {
                this.servers = data;
            });
        },
        add: function () {

        },
        remove: function (id) {
            fetch(`/servers/${id}`, { method: 'DELETE' }).then((res) => {
                if (!res.ok) throw new Error('Failed to delete', res);
            }).then(() => {
                this.servers = this.servers.filter(s => s.id !== id);
            });
        },
        setActive: function (server) {
            this.activeItem = server;
        }
    },
    components: {
        'server-edit-modal': Edit
    }
}
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
