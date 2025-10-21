<script setup lang="ts">
import { computed, type Component } from 'vue'
import SmallSpinner from '@common/components/SmallSpinner.vue'

const emit = defineEmits<{ (e: 'clicked'): void }>()

type Props = {
    type?: 'button' | 'submit' | 'reset'
    is?: 'outline' | 'danger' | 'success'
    disabled?: boolean
    loading?: boolean
    icon?: Component
}

const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
    loading: false,
})

const buttonStyles = new Map<Props['is'], string>()
buttonStyles.set(
    'outline',
    '!text-font border border-border hover:border-border-hover',
)
buttonStyles.set('danger', 'bg-danger text-white')
buttonStyles.set('success', 'bg-success')

const className = computed<string[]>(() => {
    const classes = [
        'text-page px-5 py-2 rounded-lg text-md inline-flex hover:opacity-85',
        'justify-center items-center gap-3 transition-opacity',
    ]

    if (props.loading || props.disabled) {
        classes.push('opacity-50 cursor-not-allowed pointer-events-none')
    }

    props.is
        ? classes.push(buttonStyles.get(props.is)!)
        : classes.push('bg-primary')

    return classes
})
</script>

<template>
    <div class="text-right">
        <button
            :type
            :disabled="disabled || loading"
            @click="disabled ? null : emit('clicked')"
            :class="[
                className,
                loading || disabled
                    ? 'opacity-50 cursor-not-allowed pointer-events-none'
                    : '',
            ]"
        >
            <SmallSpinner v-if="loading" class="size-5" />
            <component v-else :is="icon" class="size-5" />
            <slot />
        </button>
    </div>
</template>
