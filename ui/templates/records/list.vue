<template>
<div class="container-fluid">
    <div class="page-header">
        <h2>
            Zone <span class="zone-name">{{ zoneId }}</span>
            <small>{{ records.length }} records</small>
        </h2>
        <b-button-toolbar>
            <b-button-group>
                <b-button default class="add-record" :to="`${zoneId}/records/edit/`">
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
    <b-modal fade id="del-record" title="Delete Record" ok-title="Delete record" @ok="remove(this.activeRecord)">
        <slot>
            <strong>Warning!</strong>
            This operation will delete the <strong>{{ activeRecord }}</strong> record.
            <br> Are you sure you want to do this?
        </slot>
    </b-modal>
    <b-table striped condensed hover id="records-table" width="100%" name="records-table" :fields="fields" :items="records">
        <template slot="content" scope="row">
            {{ row.item.records[0].content }}
        </template>
        <template slot="state" scope="row">
            {{ row.item.records[0].disabled ? 'disabled' : 'active' }}
        </template>
        <template slot="actions" scope="row">
            <b-button-toolbar key-nav>
                <b-button v-if="row.item.type === 'A' || row.item.type === 'AAAA'" size="sm" default><icon label="Create PTR record from this" name="retweet" /></b-button>
                <b-button size="sm"><icon label="Edit record" name="pencil-square-o" /></b-button>
                <b-button variant="danger" size="sm" v-b-modal="'del-record'" @click="setActive(row.item.name)"><icon name="trash" label="Remove Record" /></b-button>
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

export default {
    name: 'records-list',
    data: function () {
        fetch(`/servers/${this.$route.params.serverId}/zones/${this.$route.params.zoneId}/records`)
            .then(res => res.json())
            .then(data => {
                this.records = data;
            })
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
            },
            serverId: this.$route.params.serverId,
            zoneId: this.$route.params.zoneId,
            records: [],
            activeRecord: null
        }
    },
    methods: {
        setActive: function (record) {
            this.activeRecord = record;
        },
        remove: function (record) {
            fetch(`/servers/${this.serverId}/zones/${this.zoneId}/records/${record}`, { method: 'DELETE' }).then((res) => {
                if (!res.ok) throw new Error('Failed to delete', res);
            }).then(() => {
                this.records = this.records.filter(s => s.name !== record);
            });

        }
    }
}
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
