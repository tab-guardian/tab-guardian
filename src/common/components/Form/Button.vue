<script setup lang="ts">
import type { Component } from 'vue'
import SmallSpinner from '@common/components/SmallSpinner.vue'

const emit = defineEmits<{ (e: 'clicked'): void }>()

type Props = {
    className?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    icon?: Component
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
    loading: false,
})
</script>

<template>
    <div class="text-right">
        <button
            :type
            :disabled="disabled || loading"
            @click="disabled ? null : emit('clicked')"
            :class="[
                'bg-primary text-page px-6 py-2 rounded-lg text-md inline-flex',
                'justify-center items-center gap-3',
                className,
                loading || disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
            ]"
        >
            <SmallSpinner v-if="loading" class="w-5" />
            <component v-else :is="icon" class="w-5" />
            <slot />
        </button>
    </div>
</template>
