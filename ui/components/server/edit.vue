<template>
<b-modal id="server-edit" fade :title="server.isNew ? 'Add Server' : 'Edit Server'" :ok-title="server.isNew ? 'Add Server' : 'Update'" close-title="Cancel" @ok="store">
  <form method="POST" action="/servers/">
    <b-form-fieldset label="URL:">
        <b-form-input type="text" placeholder="http://localhost:8053" name="url" v-model="server.url" />
    </b-form-fieldset>
    <b-form-fieldset label="API-Key:">
        <b-form-input type="password" placeholder="changeme" name="password" v-model="server.password" />
    </b-form-fieldset>
  </form>
</b-modal>

</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'server-edit-modal',
    props: ['server'],
    data: function () {
        return {
        };
    },
    methods: {
        store: function () {
            this.$store.dispatch('storeServer', this.server);
        }
    }
}
</script>

<style>

</style>

