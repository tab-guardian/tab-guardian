<script setup lang="ts">
type Props = {
    disabled?: boolean
    type?: 'button' | 'submit'
    isSecondary?: boolean
}

withDefaults(defineProps<Props>(), {
    disabled: false,
    type: 'button',
    isSecondary: false,
})
</script>

<template>
    <button
        :disabled
        :type
        :class="[
            'border border-border rounded-lg px-5 py-2 bg-primary text-page',
            'text-page transition-shadow inline-flex items-center gap-2',
            isSecondary
                ? 'bg-transparent !text-font border-slate-400 dark:border-slate-600'
                : '',
            disabled
                ? 'opacity-50'
                : 'opacity-90 hover:opacity-100 hover:border-border-hover',
        ]"
    >
        <slot />
    </button>
</template>
