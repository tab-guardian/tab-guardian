<script setup lang="ts">
import { useTransStore } from '@/stores/trans'

const { trans } = useTransStore()

type Emits = {
    (e: 'clicked'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
    <div class="text-right">
        <button
            type="button"
            @click="emit('clicked')"
            :class="[
                'bg-primary text-secondary px-4 py-2 rounded-md text-sm',
                'inline-flex items-center gap-2 transition-colors',
                'hover:bg-primary-hover',
            ]"
        >
            <span aria-hidden="true" aria-describedby="Enter">⏎</span>
            <slot />
        </button>
    </div>
</template>
