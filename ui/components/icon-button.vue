<template>
<b-button :to="to" :href="href" :variant="variant" :size="size" @click="emitClick" class="d-flex align-items-center">
    <icon :label="iconLabel" :name="icon" /><slot></slot>
</b-button>
</template>

<script>
export default {
    name: 'icon-button',
    props: ['to', 'href', 'size', 'iconLabel', 'icon', 'variant'],
    methods: {
        emitClick: function (e) {
            this.$emit('click', e);
        }
    }
};
</script>

<style>

</style>
