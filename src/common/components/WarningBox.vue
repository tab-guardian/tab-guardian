<script setup lang="ts">
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'

defineProps<{ message: string }>()
</script>

<template>
    <div
        class="flex items-center justify-between mb-4 mt-1 bg-unsafe p-3 rounded-lg gap-4"
    >
        <ShieldExclamationIcon class="w-8 h-8 text-red-400 flex-shrink-0" />

        <span class="text-sm">{{ message }}</span>

        <slot />
    </div>
</template>
