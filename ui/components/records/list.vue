<template>
<div class="container-fluid">
    <div class="page-header">
        <h2>
            Zone <span class="zone-name">{{ activeZone.id }}</span>
            <small>{{ records.length }} records</small>
        </h2>
        <b-button-toolbar>
            <b-button-group>
                <b-button default class="add-record" v-b-modal="'record-edit'" @click="setActiveRecord()">
                    <icon name="plus" />
                    Create record
                </b-button>
                <b-dropdown id="zone-actions" text="Zone actions">
                    <b-dropdown-item>
                        <icon label="Delete zone" name="trash" />Delete
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <icon label="Send a DNS NOTIFY to all slaves" name="retweet" />Notify
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <icon label="Retrieves the zone from the master" name="random" />Import
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <icon label="Download the zone in AXFR format" name="download" />Export
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <icon label="Verify zone contents/configuration" name="check-square-o" />Verify
                    </b-dropdown-item>
                    <b-dropdown-divider />
                    <b-dropdown-item>
                        <icon label="View Metadata" name="eye" />Zone Metadata
                    </b-dropdown-item>
                    <b-dropdown-item>
                        <icon label="Manage Keys" name="lock" />CryptoKeys
                    </b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </b-button-toolbar>
    </div>
    <b-modal fade id="del-record" title="Delete Record" ok-title="Delete record" @ok="deleteRecord()">
        <slot>
            <strong>Warning!</strong>
            This operation will delete the <strong>{{ activeRecord.name }} {{ activeRecord.type }}</strong> record.
            <br> Are you sure you want to do this?
        </slot>
    </b-modal>
    <record-edit-modal :zoneId="activeZone.id" :serverId="activeServer.id" :record="activeRecord" />
    <b-table striped condensed hover id="records-table" name="records-table" :fields="fields" :items="records">
        <template slot="content" scope="row">
            {{ row.item.record.content }}
        </template>
        <template slot="state" scope="row">
            {{ row.item.record.disabled ? 'disabled' : 'active' }}
        </template>
        <template slot="actions" scope="row">
            <b-button-toolbar key-nav>
                <b-button v-if="row.item.type === 'A' || row.item.type === 'AAAA'" size="sm" default><icon label="Create PTR record from this" name="retweet" /></b-button>
                <b-button size="sm" v-b-modal="'record-edit'" @click="setActiveRecord(row.item)"><icon label="Edit record" name="pencil-square-o" /></b-button>
                <b-button variant="danger" size="sm" v-b-modal="'del-record'" @click="setActiveRecord(row.item)"><icon name="trash" label="Remove Record" /></b-button>
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
    methods: mapActions([
        'setActiveRecord',
        'deleteRecord'
    ]),
    components: {
        'record-edit-modal': RecordEditView
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
