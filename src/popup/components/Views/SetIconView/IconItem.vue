<script setup lang="ts">
type Props = {
    selected: boolean
}

const { selected } = defineProps<Props>()
</script>

<template>
    <li
        class="border-2 border-border p-2 transition-colors rounded-lg hover:bg-secondary-hover hover:border-secondary-hover cursor-pointer flex items-center justify-center"
        :class="{ 'border-success bg-safe': selected }"
    >
        <slot />
    </li>
</template>
