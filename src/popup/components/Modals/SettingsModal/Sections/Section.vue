<script setup lang="ts">
type Props = {
    title: string
}

const { title } = defineProps<Props>()
</script>

<template>
    <section class="settings-section">
        <h2>{{ title }}</h2>
    </section>
</template>

<style lang="sass" scoped>
.settings-section
    //
</style>
