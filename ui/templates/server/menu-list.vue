<template>
<b-nav-item-dropdown text="PDNS Servers">
    <b-dropdown-item to="/servers" exact>Configure …</b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item v-for="server in servers" :key="server.id" :to="`/servers/${server.id}/zones`" exact>{{ server.name }}</b-dropdown-item>
</b-nav-item-dropdown>
</template>

<script>
import { servers } from 'javascripts/data';

export default {
    name: 'menu-server-list',
    data() {
        return {
            servers
        };
    }
}
</script>

<style>
</style>
