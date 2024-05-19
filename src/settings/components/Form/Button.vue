<script setup lang="ts">
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

type Props = {
    label: string
}

const { label } = defineProps<Props>()
</script>

<template>
    <div class="text-right">
        <button
            type="submit"
            class="bg-primary text-page px-6 py-2 rounded-lg text-md inline-flex items-center gap-2"
        >
            <CheckIcon class="w-5 h-5" />
            {{ label }}
        </button>
    </div>
</template>
