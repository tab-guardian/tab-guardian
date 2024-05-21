<script setup lang="ts">
type Props = {
    additionalClasses?: string
}

const { additionalClasses } = defineProps<Props>()
</script>

<template>
    <div class="text-right">
        <button
            type="submit"
            class="bg-primary text-page px-5 py-2 rounded-lg text-md inline-flex items-center gap-3"
            :class="additionalClasses"
        >
            <slot />
        </button>
    </div>
</template>
