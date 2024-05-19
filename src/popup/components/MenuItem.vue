<script setup lang="ts">
type Props = {
    title: string
}

const { title } = defineProps<Props>()
</script>

<template>
    <div
        :class="[
            'px-2 py-1.5 bg-page border border-border rounded-lg',
            'flex items-center gap-2 cursor-pointer transition-colors',
            'hover:border-primary hover:text-primary',
        ]"
    >
        <slot />
        <span>{{ title }}</span>
    </div>
</template>
