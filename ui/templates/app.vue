<template>
<div id="app-hook">
    <b-navbar toggleable sticky="top" type="inverse" variant="inverse">
        <b-nav-toggle target="nav_collapse" position="left"></b-nav-toggle>
        <b-link class="navbar-brand" to='/' exact>Yet Another PDNS UI</b-link>
        <b-collapse is-nav id="nav_collapse">
            <b-nav class="main" is-nav-bar />
            <b-nav is-nav-bar class="ml-auto">
                <menu-server-list />
            </b-nav>
        </b-collapse>
    </b-navbar>
    <section class="content">
        <router-view />
    </section>
</div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style src="bootstrap/dist/css/bootstrap.css" />
<style src="bootstrap-vue/dist/bootstrap-vue.css" />
