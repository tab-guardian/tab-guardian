<script setup lang="ts">
type Props = {
    title: string
    subtitle?: string
}

const { title, subtitle } = defineProps<Props>()
</script>

<template>
    <section class="bg-secondary p-6 rounded-lg border border-border">
        <h2 class="text-xl">{{ title }}</h2>
        <p class="text-lg" v-if="subtitle">{{ subtitle }}</p>

        <div class="mt-4">
            <slot />
        </div>
    </section>
</template>
