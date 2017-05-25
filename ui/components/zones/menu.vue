<template>
<b-nav>
    <span class="active navbar-brand text-muted">{{ server.name }}</span>
    <b-nav-item :to="`/servers/${server.id}/zones`">Zones</b-nav-item>
    <b-nav-item :to="`/servers/${server.id}/config`">Configuration</b-nav-item>
    <b-nav-item :to="`/servers/${server.id}/stats`">Statistics</b-nav-item>
</b-nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'zones-menu',
    computed: mapGetters({
        server: 'activeServer'
    }),
    created() {
        this.$store.dispatch('setActiveServer', this.$route.params.serverId);
    }
};
</script>

<style>

</style>
