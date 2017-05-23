<template>
<b-nav>
    <span class="active navbar-brand text-muted">{{ server.name }}</span>
    <b-nav-item :to="`/servers/${server.id}/zones`">Zones</b-nav-item>
    <b-nav-item :to="`/servers/${server.id}/config`">Configuration</b-nav-item>
    <b-nav-item :to="`/servers/${server.id}/stats`">Statistics</b-nav-item>
</b-nav>
</template>

<script>
export default {
    name: 'zones-menu',
    data: function () {
        fetch(`/servers/${this.$route.params.serverId}`)
            .then(res => res.json())
            .then(data => this.server = data);
        return {
            server: {}
        };
    }
};
</script>

<style>

</style>
