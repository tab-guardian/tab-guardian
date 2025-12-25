<script setup lang="ts">
import ArrowRightIcon from '@common/components/Icons/ArrowRightIcon.vue'

const emit = defineEmits<{ (e: 'is-dropped', dropEvent: any): void }>()

defineProps<{ label: string }>()
</script>

<template>
    <div
        @dragenter.prevent
        @dragover.prevent
        @drop.prevent="e => emit('is-dropped', e)"
        data-dropzone
        :class="[
            'border-3 border-border border-dashed rounded-md h-14 leading-4',
            'mt-3 mb-1 flex items-center justify-center gap-2 p-2',
        ]"
    >
        <ArrowRightIcon class="size-5 rotate-180 opacity-50 pointer-events-none" />

        <span class="opacity-50 pointer-events-none">
            {{ label }}
        </span>
    </div>
</template>
