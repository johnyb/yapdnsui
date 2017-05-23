<template>
<div class="zone-edit container">
    <div class="page-header">
        <h2>{{ zone.id ? `Edit zone` : 'Add zone' }}</h2>
    </div>
    <form id="form-add-domain" @submit="submit">
        <b-form-fieldset>
        <div class="form-group">
            <label for="name">Zone/Domain name:</label>
            <b-form-input name="name" type="text" placeholder="eg: example.com." v-model="zone.name" />
        </div>
        <div class="form-group">
            <label for="kind">Zone Type:</label>
            <b-form-radio :options="options" name="kind" v-model="zone.kind" stacked/>
        </div>
        <div class="form-group" v-if="zone.kind == 'Slave'">
            <label for="master">Zone master:</label>
            <b-form-input name="master" type="text" placeholder='1.2.3.4,::123:b00' v-model="zone.master" />
            <small>IP Address of the master host, which PDNS should replicate with.</small>
        </div>
        </b-form-fieldset>
        <div class="form-group">
            <b-button variant="primary" type="submit">{{ zone.id ? 'Save' : 'Add zone' }}</b-button>
        </div>
    </form>
</div>
</template>

<script>
export default {
    name: 'zones-edit',
    data: function () {
        if (this.$route.params.zoneId) {
            fetch(`/servers/${this.$route.params.serverId}/zones/${this.$route.params.zoneId}`)
                .then(res => res.json())
                .then((data) => {
                    this.zone = data;
                });
        }
        return {
            options: [
                {
                    text: `Master<small class="form-text text-muted">Send out notifications about zone changes to slaves.</small>`,
                    value: 'Master'
                },
                {
                    text: `Slave<small class="form-text text-muted">Retrieve records from master, store in database.</small>`,
                    value: 'Slave'
                },
                {
                    text: `Native<small class="form-text text-muted">"Rely on database replication, don't replicate via DNS.</small>`,
                    value: 'Native'
                }
            ],
            zone: {
                kind: 'Master'
            },
            serverId: this.$route.params.serverId
        };
    },
    methods: {
        submit: function (e) {
            e.preventDefault();
            let base = `/servers/${this.$route.params.serverId}/zones`;
            if (this.zone.id) base += '/' + this.zone.id;
            fetch(base, {
                method: this.zone.id ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.zone)
            });
        }
    }
};
</script>

<style>

</style>
