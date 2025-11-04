<script setup lang="ts">
import { trans } from '@common/modules'
import { computed, reactive } from 'vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const emit = defineEmits<{
    (e: 'has-error', has: boolean): void
    (e: 'loaded', input: HTMLInputElement): void
}>()

const pass = defineModel<string | null>('pass')
const confirm = defineModel<string | null>('confirm')

const errors = reactive({
    pass: false,
    confirm: false,
})

const matchErr = computed<string>(() => {
    return pass.value === confirm.value ? '' : trans('passwords_not_match')
})

function emitErrorEvent(hasErr: boolean, field: 'pass' | 'confirm'): void {
    errors[field] = hasErr
    emit('has-error', errors.pass || errors.confirm || matchErr.value !== '')
}
</script>

<template>
    <PasswordInput
        v-model="pass"
        @loaded="emit('loaded', $event)"
        @has-error="emitErrorEvent($event, 'pass')"
        id="group-password"
        :error="matchErr"
        :label="trans('enter_pass')"
        :with-min-length="true"
    />

    <PasswordInput
        v-model="confirm"
        @has-error="emitErrorEvent($event, 'confirm')"
        id="group-confirm-password"
        :label="trans('repeat_pass')"
    />
</template>
