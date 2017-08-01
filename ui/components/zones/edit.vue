<template>
<div class="zone-edit container">
    <div class="page-header">
        <h2>{{ zone.id ? `Edit zone` : 'Add zone' }}</h2>
    </div>
    <b-alert class="error" v-if="error" show variant="danger">{{ error }}</b-alert>
    <form id="form-add-domain" @submit="submit">
        <b-form-fieldset>
        <div class="form-group">
            <label for="zone-name">Zone/Domain name:</label>
            <b-form-input id="zone-name" name="name" type="text" placeholder="eg: example.com." v-model="name" />
        </div>
        <div class="form-group">
            <label for="kind">Zone Type:</label>
            <b-form-radio id="kind" :options="options" name="kind" v-model="kind" stacked/>
        </div>
        <div class="form-group" v-if="kind == 'Master' && !zone.id">
            <label for="nameservers">Nameservers:</label>
            <b-form-input id="nameservers" name="nameservers" type="text" placeholder='ns.example.com.,ns2.example.com.' v-model="nameservers" />
            <small>List of nameservers responsible for this zone.</small>
        </div>
        <div class="form-group" v-if="kind == 'Slave'">
            <label for="masters">Zone master:</label>
            <b-form-input id="masters" name="masters" type="text" placeholder='1.2.3.4,::123:b00' v-model="masters" />
            <small>IP Address of the master host, which PDNS should replicate with.</small>
        </div>
        <div class="form-group" v-if="kind == 'Forwarded'">
            <label for="servers">Forwarded to:</label>
            <b-form-input id="servers" name="servers" type="text" placeholder='1.2.3.4:53,[::123:b00]:5300' v-model="servers" />
            <small>IP Addresses and ports of the servers, this zone is forwarded to.</small>
        </div>
        <div class="form-group" v-if="kind == 'Forwarded'">
            <b-form-checkbox id="recursion-desired" name="recursion_desired" v-model="recursion_desired">
                Recursion desired
            </b-form-checkbox>
            <small class="form-text text-muted">Set the "recursion desired" flag when forwarding requests accordingly.</small>
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

function mkServersList(value) {
    return value.split(',').map(v => v.trim());
}

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
                this.$store.commit('updateZone', { nameservers: mkServersList(value) });
            }
        },
        servers: {
            get() {
                return this.$store.getters.activeZone.servers.join(', ');
            },
            set(value) {
                this.$store.commit('updateZone', { servers: mkServersList(value) });
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
        },
        recursion_desired: {
            get() {
                return this.$store.getters.activeZone.recursion_desired;
            },
            set(value) {
                this.$store.commit('updateZone', { recursion_desired: value });
            }
        },
        options: {
            get() {
                if (this.$store.getters.activeServer.daemon_type === 'recursor') {
                    return [
                        {
                            text: `Forwarded<small class="form-text text-muted">Zone forwarded to an authoritive server.</small>`,
                            value: 'Forwarded'
                        },
                        {
                            text: `Native<small class="form-text text-muted">"Rely on database replication, don't replicate via DNS.</small>`,
                            value: 'Native'
                        }
                    ];
                }
                return [
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
                ];
            }
        }
    },
    mapGetters({
        zone: 'activeZone',
        error: 'lastError'
    })),
    created() {
        this.$store.dispatch('setActiveZone', this.$route.params.zoneId || this.defaultZone);
        this.$store.commit('clearError');
    },
    data: function () {
        return {
            defaultZone: {
                name: '',
                kind: '',
                nameservers: [],
                masters: [],
                servers: [],
                recursion_desired: false
            }
        };
    },
    methods: {
        submit: function (ev) {
            this.$store.dispatch('updateZone', ev)
                .then((success) => success ? this.$router.replace(`../`) : '');
        }
    }
};
</script>

<style>

</style>
