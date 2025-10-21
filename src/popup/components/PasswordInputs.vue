<script setup lang="ts">
import { trans } from '@common/modules'
import { computed } from 'vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const emit = defineEmits<{
    (e: 'hasError', has: boolean): void
    (e: 'loaded', input: HTMLInputElement): void
}>()

const pass = defineModel<string | null>('pass')
const confirm = defineModel<string | null>('confirm')

const confirmErr = computed<string>(() => {
    return pass.value === confirm.value
        ? ''
        : trans('passwords_not_match')
})
</script>

<template>
    <PasswordInput
        v-model="pass"
        @loaded="emit('loaded', $event)"
        @has-error="emit('hasError', $event)"
        id="group-password"
        :error="confirmErr"
        :label="trans('enter_pass')"
        :with-min-length="true"
    />

    <PasswordInput
        v-model="confirm"
        @has-error="emit('hasError', $event)"
        id="group-confirm-password"
        :label="trans('repeat_pass')"
    />
</template>
