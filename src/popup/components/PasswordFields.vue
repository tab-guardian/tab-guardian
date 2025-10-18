<script setup lang="ts">
import { trans } from '@common/modules'
import { computed, ref } from 'vue'
import { config } from '@common/config'
import { passwordError } from '@common/modules/validation/group'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const emit = defineEmits<{
    (e: 'hasError', has: boolean): void
    (e: 'loaded', input: HTMLInputElement): void
}>()

const pass = defineModel<string | null>('pass')
const confirm = defineModel<string | null>('confirm')

const errMsg = ref<string | null>(null)

const passErr = computed<string | null>(() => {
    return passwordError(pass.value || null, confirm.value || null)
})

function keyupEventHandler(): void {
    const hasError = passErr.value !== null && passErr.value !== ''

    emit('hasError', hasError)

    if (!pass.value && !confirm.value) {
        errMsg.value = null
        return
    }

    errMsg.value = passErr.value
}
</script>

<template>
    <PasswordInput
        v-model="pass"
        @loaded="el => emit('loaded', el)"
        @keyup="keyupEventHandler"
        id="group-password"
        :error="errMsg"
        :label="trans('enter_pass')"
        :minlength="config.MIN_PASS_LENGTH"
    />

    <PasswordInput
        v-model="confirm"
        @keyup="keyupEventHandler"
        id="group-confirm-password"
        :label="trans('repeat_pass')"
        :minlength="config.MIN_PASS_LENGTH"
    />
</template>
