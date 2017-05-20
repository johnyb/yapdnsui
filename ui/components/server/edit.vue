<template>
<b-modal id="server-edit" fade :title="server.isNew ? 'Add Server' : 'Edit Server'" :ok-title="server.isNew ? 'Add Server' : 'Update'" close-title="Cancel" @ok="store" @shown="updateData">
  <form method="POST" action="/servers/">
    <b-form-fieldset label="URL:">
        <b-form-input type="text" placeholder="http://localhost:8053" name="url" v-model="url" />
    </b-form-fieldset>
    <b-form-fieldset label="API-Key:">
        <b-form-input type="password" placeholder="changeme" name="password" v-model="password" />
    </b-form-fieldset>
  </form>
</b-modal>

</template>

<script>
export default {
    name: 'server-edit-modal',
    props: ['server'],
    data: function () {
        return {
            url: null,
            password: null
        };
    },
    methods: {
        updateData: function () {
            this.url = this.server.url;
            this.password = this.server.password;
        },
        store: function () {
            const url = this.url,
                password = this.password,
                id = this.server.id ? `/${this.server.id}` : '';
            let method = "PUT";

            if (this.server.isNew) {
                delete this.server.isNew;
                method = "POST"
            }

            fetch(`/servers${id}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url,
                    password
                }),
            }).then(res => {
                if (res.ok) return res.body;

                throw new Error('Failed to add server', res);
            }).then(server => {
                console.log(server);
            });
        }
    }
}
</script>

<style>

</style>

