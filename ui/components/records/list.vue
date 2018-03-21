<template>
<div class="container-fluid">
    <div class="page-header">
        <h2>
            Zone <span class="zone-name">{{ activeZone.id }}</span>
            <small>{{ records.length }} records</small>
        </h2>
        <b-button-toolbar>
            <b-button-group>
                <icon-button default class="add-record" v-b-modal="'record-edit'" @click="setActiveRecord()" icon="plus">
                    &nbsp;Create record
                </icon-button>
                <b-dropdown id="zone-actions" text="Zone actions" right>
                    <b-dropdown-item class="d-flex align-items-center">
                        <icon label="Delete zone" name="trash" />&nbsp;Delete
                    </b-dropdown-item>
                    <b-dropdown-item class="d-flex align-items-center" v-if="activeZone.kind === 'Master'" @click="notifyZone">
                        <icon label="Send a DNS NOTIFY to all slaves" name="retweet" />&nbsp;Notify
                    </b-dropdown-item>
                    <b-dropdown-item class="d-flex align-items-center" v-if="activeZone.kind === 'Slave'" @click="retrieveZone">
                        <icon label="Retrieves the zone from the master" name="random" />&nbsp;Retrieve
                    </b-dropdown-item>
                    <b-dropdown-item class="d-flex align-items-center" :href="`/endpoints/${activeServer.id}/${activeZone.url}/export`" :download="`${activeZone.id}axfr`">
                        <icon label="Download the zone in AXFR format" name="download" />&nbsp;Export
                    </b-dropdown-item>
                    <b-dropdown-item class="d-flex align-items-center" @click="verifyZone">
                        <icon label="Verify zone contents/configuration" name="check-square-o" />&nbsp;Verify
                    </b-dropdown-item>
                    <b-dropdown-divider />
                    <b-dropdown-item class="d-flex align-items-center">
                        <icon label="View Metadata" name="eye" />&nbsp;Zone Metadata
                    </b-dropdown-item>
                    <b-dropdown-item class="d-flex align-items-center">
                        <icon label="Manage Keys" name="lock" />&nbsp;CryptoKeys
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </b-button-toolbar>
    </div>
    <b-modal fade id="del-record" title="Delete Record" ok-title="Delete record" @ok="deleteRecord()" close-title="Cancel">
        <slot>
            <strong>Warning!</strong>
            This operation will delete the <strong>{{ activeRecord.name }} {{ activeRecord.type }}</strong> record.
            <br> Are you sure you want to do this?
        </slot>
    </b-modal>
    <record-edit-modal :zoneId="activeZone.id" :serverId="activeServer.id" :record="activeRecord" />
    <b-table striped condensed hover id="records-table" name="records-table" :fields="fields" :items="records">
        <template slot="name" slot-scope="row">
            {{ simplifyName(row.item.name) }}
        </template>
        <template slot="content" slot-scope="row">
            {{ row.item.record.content }}
        </template>
        <template slot="state" slot-scope="row">
            {{ row.item.record.disabled ? 'disabled' : 'active' }}
        </template>
        <template slot="actions" slot-scope="row">
            <b-button-toolbar key-nav>
                <icon-button v-if="row.item.type === 'A' || row.item.type === 'AAAA'" size="sm" default iconLabel="Create PTR record from this" icon="retweet"></icon-button>
                <icon-button size="sm" v-b-modal="'record-edit'" @click="setActiveRecord(row.item)" iconLabel="Edit record" icon="pencil-square-o"></icon-button>
                <icon-button variant="danger" size="sm" v-b-modal="'del-record'" @click="setActiveRecord(row.item)" icon="trash" iconLabel="Remove Record" /></icon-button>
            </b-button-toolbar>
        </template>
    </b-table>
</div>
</template>

<script>
import 'vue-awesome/icons/trash';
import 'vue-awesome/icons/retweet';
import 'vue-awesome/icons/random';
import 'vue-awesome/icons/download';
import 'vue-awesome/icons/check-square-o';
import 'vue-awesome/icons/eye';
import 'vue-awesome/icons/lock';

import IconButton from '../icon-button.vue';

import RecordEditView from './edit.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'records-list',
    computed: mapGetters([
        'records',
        'activeZone',
        'activeServer',
        'activeRecord'
    ]),
    created() {
        if (!this.$store.getters.activeServer.id || !this.$store.getters.activeZone.url) {
            this.$store.dispatch('setActiveServer', this.$route.params.serverId);
            this.$store.dispatch('setActiveZone', this.$route.params.zoneId);
            const handler = this.$store.watch(() => {
                return {
                    server: this.$store.getters.activeServer,
                    zone: this.$store.getters.activeZone
                };
            }, ({ server, zone }) => {
                if (!server.id || !zone.url) return this.$store.dispatch('getZones');
                this.$store.dispatch('getRecords');
                handler();
            });
        } else {
            this.$store.dispatch('getRecords');
        }
    },
    destroyed() {
        this.$store.dispatch('setActiveZone', null);
    },
    data: function () {
        return {
            fields: {
                name: {
                    label: 'Name'
                },
                type: {
                    label: 'Type'
                },
                priority: {
                    label: 'Prio'
                },
                content: {
                    label: 'Content'
                },
                ttl: {
                    label: 'TTL'
                },
                state: {
                    label: 'State'
                },
                actions: {}
            }
        };
    },
    methods: Object.assign({
        simplifyName: function (name) {
            return name === this.activeZone.name ? '@' : name.replace(new RegExp(`.${this.activeZone.name}$`), '');
        }
    }, mapActions([
        'verifyZone',
        'retrieveZone',
        'notifyZone',
        'setActiveRecord',
        'deleteRecord'
    ])),
    components: {
        'record-edit-modal': RecordEditView,
        'icon-button': IconButton
    }
};
</script>

<style <style lang="scss">
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
