<script setup lang="ts">
import { trans } from '@common/modules'
import { computed } from 'vue'
import { config } from '@common/config'
import Input from '@common/components/Form/Input.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
    (e: 'hasError', has: boolean): void
}>()

const name = defineModel<string | null>('name')

const meta = computed<string>(() => {
    if (!name.value) {
        return ''
    }

    return `${name.value.length} / ${config.MAX_GROUP_NAME_LENGTH}`
})

const nameErr = computed<string>(() => {
    return name.value && name.value.length > config.MAX_GROUP_NAME_LENGTH
        ? trans('group_name_long')
        : ''
})
</script>

<template>
    <Input
        v-model="name"
        @loaded="emit('loaded', $event)"
        @keyup="emit('hasError', nameErr !== '')"
        :label="trans('group_name')"
        :error="nameErr"
        type="text"
        id="group-name"
        :meta
    />
</template>
