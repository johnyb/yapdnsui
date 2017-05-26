<template>
<b-modal id="record-edit" fade :title="record.isNew ? 'Add record' : 'Edit record'" :ok-title="record.isNew ? 'Add record' : 'Update'" @ok="updateRecord">
    <form class="modal-form" method="POST" enctype="application/json">
        <b-form-fieldset>
            <label for="name">Name</label>
            <b-form-input name="name" type="text" placeholder="eg. full FQDN or leave empty" v-model="activeRecord.name" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="type">Type</label>
            <b-form-select :options="dnstypes" name="name" type="text" placeholder="eg. full FQDN or leave empty" v-model="activeRecord.type" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="priority">Priority</label>
            <b-form-input name="priority" type="text" placeholder="0" v-model="activeRecord.priority" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="content">Content</label>
            <b-form-input name="content" type="text" :placeholder="`eg. 192.0.43.10, web01.${zoneId}`" v-model="activeRecord.record.content" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="ttl">TTL</label>
            <b-form-input name="ttl" type="text" placeholder="86400" v-model="activeRecord.ttl" />
        </b-form-fieldset>
        <b-form-fieldset>
            <b-form-checkbox name="disabled" type="text" v-model="activeRecord.record.disabled">
                <label for="disabled">Disabled</label>
            </b-form-checkbox>
        </b-form-fieldset>
    </form>
</b-modal>
</template>

<script>

import { mapActions, mapGetters } from 'vuex';

const dnstypes = ['A', 'AAAA', 'CERT', 'CNAME', 'HINFO', 'KEY', 'LOC', 'MX', 'NAPTR', 'NS', 'PTR', 'RP', 'SOA', 'SPF', 'SSHFP', 'SRV', 'TXT'];

export default {
    name: 'edit-record',
    props: ['serverId', 'zoneId', 'record'],
    computed: mapGetters([
        'activeRecord'
    ]),
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
