<template>
<b-nav-item-dropdown text="PDNS Servers" right>
    <b-dropdown-item to="/servers" exact>Configure …</b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item v-for="server in servers" :key="server.id" :to="`/servers/${server.id}/zones`" exact>{{ server.name }}</b-dropdown-item>
</b-nav-item-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'menu-server-list',
    computed: mapGetters({
        servers: 'getServers'
    }),
    created () {
        this.$store.dispatch('getServers');
    }
};
</script>

<style>
</style>
