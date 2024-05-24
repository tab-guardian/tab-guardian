<script setup lang="ts">
type Props = {
    additionalClasses?: string
    type?: 'button' | 'submit' | 'reset'
}

type Emits = {
    (e: 'clicked'): void
}

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
</script>

<template>
    <div class="text-right">
        <button
            :type="props.type || 'button'"
            class="bg-primary text-page px-3 py-2 rounded-lg text-md inline-flex items-center gap-3"
            :class="props.additionalClasses"
            @click="emit('clicked')"
        >
            <slot />
        </button>
    </div>
</template>
