<template>
<b-button :variant="variant" :size="size" class="d-flex align-items-center">
    <icon :label="iconLabel" :name="icon" /><slot></slot>
</b-button>
</template>

<script>
export default {
    name: 'icon-button',
    props: ['size', 'iconLabel', 'icon', 'variant']
};
</script>

<style>

</style>
