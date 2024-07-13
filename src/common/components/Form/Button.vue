<script setup lang="ts">
const emit = defineEmits<{
    (e: 'clicked'): void
}>()

defineProps<{
    additionalClasses?: string
    type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
    <div class="text-right">
        <button
            :type="type || 'button'"
            :class="[
                'bg-primary text-page px-6 py-2 rounded-lg text-md inline-flex',
                'justify-center items-center gap-3',
                additionalClasses,
            ]"
            @click="emit('clicked')"
        >
            <slot />
        </button>
    </div>
</template>
