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
    padding: 20px
    border: 1px solid var(--tg-color-border)
    border-radius: 8px

    h2
        margin: 0
        font-size: 1.2rem
        font-weight: bold

    p
        color: var(--tg-color-font-gray)
        font-size: 1rem
        margin: 0 0 7px 0
</style>
