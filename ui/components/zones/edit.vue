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
        <div class="form-group" v-if="kind == 'Master' && !zone.id">
            <label for="nameservers">Nameservers:</label>
            <b-form-input name="nameservers" type="text" placeholder='ns.example.com.,ns2.example.com.' v-model="nameservers" />
            <small>List of nameservers responsible for this zone.</small>
        </div>
        <div class="form-group" v-if="kind == 'Slave'">
            <label for="masters">Zone master:</label>
            <b-form-input name="masters" type="text" placeholder='1.2.3.4,::123:b00' v-model="masters" />
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
import { mapGetters } from 'vuex';

export default {
    name: 'zones-edit',
    computed: Object.assign({
        masters: {
            get() {
                return this.$store.getters.activeZone.masters.join(', ');
            },
            set(value) {
                this.$store.commit('updateZone', { masters: value.split(',').map(v => v.trim()) });
            }
        },
        nameservers: {
            get() {
                return this.$store.getters.activeZone.nameservers.join(', ');
            },
            set(value) {
                this.$store.commit('updateZone', { nameservers: value.split(',').map(v => v.trim()) });
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
        this.$store.dispatch('setActiveZone', this.$route.params.zoneId || this.defaultZone);
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
            ],
            defaultZone: {
                name: '',
                kind: '',
                nameservers: [],
                masters: []
            }
        };
    },
    methods: {
        submit: function (ev) {
            this.$store.dispatch('updateZone', ev)
                .then(() => this.$router.replace(`../`));
        }
    }
};
</script>

<style>

</style>
