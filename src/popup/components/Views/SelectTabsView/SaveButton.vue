<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { trans } = useTransStore()

type Emits = {
    (e: 'clicked'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
    <div class="text-right mt-3">
        <button
            type="button"
            @click="emit('clicked')"
            :class="[
                'bg-primary text-secondary px-4 py-2 rounded-md text-sm',
                'inline-flex items-center gap-2 transition-colors',
                'hover:bg-primary-hover',
            ]"
        >
            <CheckIcon width="17" height="17" />
            {{ trans('Save') }}
        </button>
    </div>
</template>
