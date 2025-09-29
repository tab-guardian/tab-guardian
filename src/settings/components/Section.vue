<script setup lang="ts">
type Props = {
    title: string
    subtitle?: string
}

const { title, subtitle } = defineProps<Props>()
</script>

<template>
    <section class="p-5 border border-border rounded-xl">
        <h2 class="text-xl">{{ title }}</h2>
        <p class="text-md text-font-gray" v-if="subtitle">{{ subtitle }}</p>

        <div class="mt-4">
            <slot />
        </div>
    </section>
</template>
