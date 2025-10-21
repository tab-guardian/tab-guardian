<script setup lang="ts">
import { trans } from '@common/modules'
import { computed } from 'vue'
import { GROUP_NAME_MAX_LENGTH } from '@common/modules/validation/group'
import Input from '@common/components/Form/Input.vue'

const name = defineModel<string | null>('name')

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
}>()

const meta = computed<string>(() => {
    if (!name.value) {
        return ''
    }

    return `${name.value.length} / ${GROUP_NAME_MAX_LENGTH}`
})
</script>

<template>
    <Input
        v-model="name"
        :label="trans('group_name')"
        @loaded="emit('loaded', $event)"
        :meta
        :maxlength="GROUP_NAME_MAX_LENGTH"
        type="text"
        id="new-group-name"
    />
</template>
