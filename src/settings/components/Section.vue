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
