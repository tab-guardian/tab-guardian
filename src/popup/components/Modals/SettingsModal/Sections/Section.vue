<script setup lang="ts">
type Props = {
    title: string
    subtitle: string
}

const { title, subtitle } = defineProps<Props>()
</script>

<template>
    <section class="settings-section">
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>

        <slot />
    </section>
</template>

<style lang="sass" scoped>
.settings-section
    background-color: var(--tg-color-bg)
    padding: 12px
    border-radius: 5px

    h2
        margin: 0 0 3px 0
        font-size: .9rem

    p
        color: var(--tg-color-font-gray)
        font-size: .8rem
        margin: 0 0 7px 0
</style>
