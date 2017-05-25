<template>
<b-modal id="record-edit" fade :title="record.isNew ? 'Add record' : 'Edit record'" :ok-title="record.isNew ? 'Add record' : 'Update'" @ok="updateRecord">
    <form class="modal-form" method="POST" enctype="application/json">
        <b-form-fieldset>
            <label for="name">Name</label>
            <b-form-input name="name" type="text" placeholder="eg. full FQDN or leave empty" v-model="name" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="type">Type</label>
            <b-form-select :options="dnstypes" name="name" type="text" placeholder="eg. full FQDN or leave empty" v-model="type" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="priority">Priority</label>
            <b-form-input name="priority" type="text" placeholder="0" v-model="priority" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="content">Content</label>
            <b-form-input name="content" type="text" :placeholder="`eg. 192.0.43.10, web01.${zoneId}`" v-model="content" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="ttl">TTL</label>
            <b-form-input name="ttl" type="text" placeholder="86400" v-model="ttl" />
        </b-form-fieldset>
        <b-form-fieldset>
            <b-form-checkbox name="disabled" type="text" v-model="disabled">
                <label for="disabled">Disabled</label>
            </b-form-checkbox>
        </b-form-fieldset>
    </form>
</b-modal>
</template>

<script>

import { mapActions } from 'vuex';

const dnstypes = ['A', 'AAAA', 'CERT', 'CNAME', 'HINFO', 'KEY', 'LOC', 'MX', 'NAPTR', 'NS', 'PTR', 'RP', 'SOA', 'SPF', 'SSHFP', 'SRV', 'TXT'];

export default {
    name: 'edit-record',
    props: ['serverId', 'zoneId', 'record'],
    computed: {
        name: {
            get() { return this.$store.getters.activeRecord.name; },
            set(value) { this.$store.commit('updateRecord', { name: value }); }
        },
        disabled: {
            get() { return !!this.$store.getters.activeRecord.records && this.$store.getters.activeRecord.records[0].disabled === true; },
            set(value) { this.$store.commit('updateRecord', { 'records.0.disabled': value }); }
        },
        ttl: {
            get() { return this.$store.getters.activeRecord.ttl; },
            set(value) { this.$store.commit('updateRecord', { ttl: value }); }
        },
        type: {
            get() { return this.$store.getters.activeRecord.type; },
            set(value) { this.$store.commit('updateRecord', { type: value }); }
        },
        content: {
            get() { return this.$store.getters.activeRecord.records && this.$store.getters.activeRecord.records[0].content; },
            set(value) { this.$store.commit('updateRecord', { 'records.0.content': value }); }
        },
        priority: {
            get() { return this.$store.getters.activeRecord.priority; },
            set(value) { this.$store.commit('updateRecord', { priority: value }); }
        }
    },
    data: function () {
        return {
            dnstypes
        };
    },
    methods: mapActions([
        'updateRecord'
    ])
};
</script>

<style>

</style>
