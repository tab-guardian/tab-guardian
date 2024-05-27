<script setup lang="ts">
type Props = {
    selected: boolean
}

const { selected } = defineProps<Props>()
</script>

<template>
    <li
        class="border-2 border-border p-2 transition-colors rounded-lg hover:bg-secondary cursor-pointer flex items-center justify-center"
        :class="{ 'border-private bg-safe': selected }"
    >
        <slot />
    </li>
</template>
