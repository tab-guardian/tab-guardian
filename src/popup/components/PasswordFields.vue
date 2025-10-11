<script setup lang="ts">
import { trans } from '@common/modules/utils'
import { computed } from 'vue'
import { env } from '@common/env'
import { passwordError } from '@common/modules/validation/group'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const emit = defineEmits<{
    (e: 'hasError', has: boolean): void
    (e: 'loaded', input: HTMLInputElement): void
}>()

const pass = defineModel<string | null>('pass')
const confirm = defineModel<string | null>('confirm')

const passwordErr = computed<string | null>(() => {
    return passwordError(pass.value || null, confirm.value || null)
})

function emitHasErrorEvent(): void {
    emit('hasError', passwordErr.value !== null && passwordErr.value !== '')
}
</script>

<template>
    <PasswordInput
        v-model="pass"
        @loaded="el => emit('loaded', el)"
        @keyup="emitHasErrorEvent"
        id="group-password"
        :error="passwordErr"
        :label="trans('enter_pass')"
        :minlength="env.MIN_PASS_LENGTH"
    />

    <PasswordInput
        v-model="confirm"
        @keyup="emitHasErrorEvent"
        id="group-confirm-password"
        :label="trans('repeat_pass')"
        :minlength="env.MIN_PASS_LENGTH"
    />
</template>
