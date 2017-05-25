<template>
<div class="zone-edit container">
    <div class="page-header">
        <h2>{{ zone.id ? `Edit zone` : 'Add zone' }}</h2>
    </div>
    <form id="form-add-domain" @submit="submit">
        <b-form-fieldset>
        <div class="form-group">
            <label for="name">Zone/Domain name:</label>
            <b-form-input name="name" type="text" placeholder="eg: example.com." v-model="name" />
        </div>
        <div class="form-group">
            <label for="kind">Zone Type:</label>
            <b-form-radio :options="options" name="kind" v-model="kind" stacked/>
        </div>
        <div class="form-group" v-if="zone.kind == 'Master'">
            <label for="master">Nameservers:</label>
            <b-form-input name="master" type="text" placeholder='1.2.3.4,::123:b00' v-model="nameservers" />
            <small>List of nameservers responsible for this zone.</small>
        </div>
        <div class="form-group" v-if="zone.kind == 'Slave'">
            <label for="master">Zone master:</label>
            <b-form-input name="master" type="text" placeholder='1.2.3.4,::123:b00' v-model="master" />
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
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'zones-edit',
    computed: Object.assign({
        master: {
            get() {
                return this.$store.getters.activeZone.master;
            },
            set(value) {
                this.$store.commit('updateZone', { master: value });
            }
        },
        nameservers: {
            get() {
                return this.$store.getters.activeZone.nameservers;
            },
            set(value) {
                this.$store.commit('updateZone', { nameservers: value });
            }
        },
        kind: {
            get() {
                return this.$store.getters.activeZone.kind;
            },
            set(value) {
                this.$store.commit('updateZone', { kind: value });
            }
        },
        name: {
            get() {
                return this.$store.getters.activeZone.name;
            },
            set(value) {
                this.$store.commit('updateZone', { name: value });
            }
        }
    },
    mapGetters({
        zone: 'activeZone'
    })),
    created() {
        this.$store.dispatch('setActiveZone', this.$route.params.zoneId);
    },
    data: function () {
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
            ]
        };
    },
    methods: mapActions({
        submit: 'updateZone'
    })
};
</script>

<style>

</style>
