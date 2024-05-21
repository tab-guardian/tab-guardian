<script setup lang="ts">
type Props = {
    additionalClasses?: string
    type?: 'button' | 'submit' | 'reset'
}

const props = defineProps<Props>()
</script>

<template>
    <div class="text-right">
        <button
            :type="props.type || 'button'"
            class="bg-primary text-page px-5 py-2 rounded-lg text-md inline-flex items-center gap-3"
            :class="props.additionalClasses"
        >
            <slot />
        </button>
    </div>
</template>
