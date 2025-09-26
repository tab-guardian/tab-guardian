<script setup lang="ts">
import { trans } from '@common/modules/trans'
import { computed } from 'vue'
import { GROUP_NAME_MAX_LENGTH } from '@/modules/groupValidation'
import Input from '@common/components/Form/Input.vue'

const name = defineModel<string | null>('name')

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
        @loaded="inp => inp.focus()"
        :meta
        :maxlength="GROUP_NAME_MAX_LENGTH"
        type="text"
        id="new-group-name"
    />
</template>
