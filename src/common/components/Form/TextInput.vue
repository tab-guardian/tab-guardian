<script setup lang="ts">
import { trans } from '@common/modules'
import { computed } from 'vue'
import { config } from '@common/config'
import Input from '@common/components/Form/Input.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
    (e: 'has-error', has: boolean): void
}>()

defineProps<{ label: string }>()

const text = defineModel<string | null>('text')

const meta = computed<string>(() => {
    if (!text.value) {
        return ''
    }

    return `${text.value.length} / ${config.MAX_NAME_LENGTH}`
})

const textErr = computed<string>(() => {
    return text.value && text.value.length > config.MAX_NAME_LENGTH
        ? trans('text_long')
        : ''
})
</script>

<template>
    <Input
        v-model="text"
        @loaded="emit('loaded', $event)"
        @keyup="emit('has-error', textErr !== '')"
        :label
        :error="textErr"
        type="text"
        id="text-field-value"
        :meta
    />
</template>
