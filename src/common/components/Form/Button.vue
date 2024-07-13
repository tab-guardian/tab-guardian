<script setup lang="ts">
const emit = defineEmits<{
    (e: 'clicked'): void
}>()

type Props = {
    additionalClasses?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    type: 'button',
    disabled: false,
})
</script>

<template>
    <div class="text-right">
        <button
            :type="type"
            :class="[
                'bg-primary text-page px-6 py-2 rounded-lg text-md inline-flex',
                'justify-center items-center gap-3',
                additionalClasses,
                disabled ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            @click="disabled ? null : emit('clicked')"
        >
            <slot />
        </button>
    </div>
</template>
