<template>
<b-modal id="record-edit" fade :title="record.isNew ? 'Add record' : 'Edit record'" :ok-title="record.isNew ? 'Add record' : 'Update'" @ok="store" @shown="updateData">
    <form class="modal-form" method="POST" enctype="application/json" :action="`${zoneId}/${record}`">
        <b-form-fieldset>
            <label for="name">Name</label>
            <b-form-input name="name" type="text" placeholder="eg. full FQDN or leave empty" v-model="editedRecord.name" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="type">Type</label>
            <b-form-select :options="dnstypes" name="name" type="text" placeholder="eg. full FQDN or leave empty" v-model="editedRecord.type" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="priority">Priority</label>
            <b-form-input name="priority" type="text" placeholder="0" v-model="editedRecord.priority" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="content">Content</label>
            <b-form-input name="content" type="text" :placeholder="`eg. 192.0.43.10, web01.${zoneId}`" v-model="editedRecord.records[0].content" />
        </b-form-fieldset>
        <b-form-fieldset>
            <label for="ttl">TTL</label>
            <b-form-input name="ttl" type="text" placeholder="86400" v-model="editedRecord.ttl" />
        </b-form-fieldset>
        <b-form-fieldset>
            <b-form-checkbox name="disabled" type="text" v-model="editedRecord.records[0].disabled">
                <label for="disabled">Disabled</label>
            </b-form-checkbox>
        </b-form-fieldset>
    </form>
</b-modal>
</template>

<script>

const dnstypes = ['A', 'AAAA', 'CERT', 'CNAME', 'HINFO', 'KEY', 'LOC', 'MX', 'NAPTR', 'NS', 'PTR', 'RP', 'SOA', 'SPF', 'SSHFP', 'SRV', 'TXT'];

export default {
    name: 'edit-record',
    props: ['serverId', 'zoneId', 'record'],
    data: function () {
        let defaultData = Object.create(this.record);
        if (defaultData.isNew) {
            defaultData.type = 'AAAA';
            defaultData.records = [{ disabled: false }];
        }
        return {
            editedRecord: defaultData,
            dnstypes
        };
    },
    methods: {
        updateData: function () {
            let defaultData = Object.create(this.record);
            if (defaultData.isNew) {
                defaultData.type = 'AAAA';
                defaultData.records = [{ disabled: false }];
            }
            this.editedRecord = defaultData;
        },
        store: function () {
            let method = "PUT",
                id = `/${this.editedRecord.name}/${this.editedRecord.type}`;

            if (this.editedRecord.isNew) {
                delete this.editedRecord.isNew;
                id = '';
                method = "POST";
            }

            fetch(`/servers/${this.serverId}/zones/${this.zoneId}/records${id}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.editedRecord.name,
                    type: this.editedRecord.type,
                    records: this.editedRecord.records,
                    ttl: this.editedRecord.ttl,
                    priority: this.editedRecord.priority
                }),
            }).then(res => {
                if (res.ok) return res.json();

                throw new Error('Failed to add server', res);
            });
        }
    }
};
</script>

<style>

</style>
