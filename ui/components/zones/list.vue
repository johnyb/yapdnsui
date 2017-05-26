<template>
<div class="container-fluid">
    <div class="page-header">
        <h2>
            Zones
            <small>
                <span class="zone-counter">{{ zones.length }} zones in {{ server.name }}</span>
            </small>
        </h2>
        <b-button-toolbar>
            <b-button-group>
                <b-button default class="add-zone" :to="'zones/edit/'">
                    <icon name="plus" />
                    Create zone
                </b-button>
                <b-button default class="import-zone" disabled id="import-zone">
                    <icon label="Import zone" name="upload" />
                    Import zone
                </b-button>
            </b-button-group>
        </b-button-toolbar>
    </div>
    <div>
        <b-modal fade id="del-zone" title="Delete Zone" ok-title="Delete zone" @ok="remove(activeZone)">
            <slot>
                Warning! This operation will delete the zone and all associated records for
                <strong>{{ activeZone }}</strong>
                <br>Are you sure you want to do this?
            </slot>
        </b-modal>
        <b-table striped condensed hover id="zones-table" width="100%" name="zones-table" :fields="fields" :items="zones">
            <template slot="name" scope="row">
                <b-link :to="`/servers/${server.id}/zones/${row.item.name}`">{{ row.item.name }}</b-link>
            </template>
            <template slot="actions" scope="row">
                <b-button-toolbar key-nav>
                    <b-button size="sm" v-if="row.item.kind === 'Slave'"><icon label="Retrieves the zone from the master" name="random" /></b-button>
                    <b-button size="sm" v-if="row.item.kind === 'Master'"><icon label="Send a DNS NOTIFY to all slaves" name="retweet" /></b-button>
                    <b-button size="sm" :href="`/server/${server.id}/zones/${row.item.id}.axfr`"><icon label="Returns the zone in AXFR format" name="download" /></b-button>
                    <b-button size="sm" @click="verify(row.item.id)"><icon label="Verify zone contents/configuration" name="check-square-o" /></b-button>
                    <b-button size="sm" :to="`zones/edit/${row.item.id}`"><icon label="Edit Zone" name="pencil-square-o" /></b-button>
                    <b-button variant="danger" size="sm" v-b-modal="'del-zone'" @click="setActive(row.item.id)"><icon name="trash" label="Remove Zone" /></b-button>
                </b-button-toolbar>
            </template>
        </b-table>
    </div>
</div>
</template>

<script>
import 'vue-awesome/icons/upload';
import 'vue-awesome/icons/download';
import 'vue-awesome/icons/plus';
import 'vue-awesome/icons/check-square-o';
import 'vue-awesome/icons/random';
import 'vue-awesome/icons/retweet';

import { mapGetters } from 'vuex';

export default {
    name: 'zones-list',
    computed: mapGetters({
        zones: 'getZones',
        server: 'activeServer'
    }),
    created() {
        if (!this.$store.getters.activeServer.id) {
            const handler = this.$store.watch(() => this.$store.getters.activeServer, () => {
                this.$store.dispatch('getZones');
                handler();
            });
        } else {
            this.$store.dispatch('getZones');
        }
    },
    data: function () {
        return {
            fields: {
                name: {
                    label: 'Name'
                },
                kind: {
                    label: 'Type'
                },
                masters: {
                    label: 'Masters'
                },
                dnssec: {
                    label: 'DNSSEC'
                },
                serial: {
                    label: 'Serial'
                },
                actions: {}
            },
            activeZone: null
        };
    },
    methods: {
        setActive: function (zone) {
            this.activeZone = zone;
        },
        remove: function (zoneId) {
            this.$store.dispatch('deleteZone', { zoneId });
        },
        verify: function () {
        }
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
