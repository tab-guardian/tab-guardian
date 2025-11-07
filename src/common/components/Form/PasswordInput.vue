<script setup lang="ts">
import { config } from '@common/config'
import { computed, onMounted } from 'vue'
import { trans } from '@common/modules'
import Input from '@common/components/Form/Input.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
    (e: 'has-error', has: boolean): void
}>()

type Props = {
    label: string
    id: string
    withButton?: boolean
    loading?: boolean
    error?: string | null
    withMinLength?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    withButton: false,
    withMinLength: false,
})

const pass = defineModel<string | null>()

onMounted(() => emit('has-error', isTooShort()))

const passErr = computed<string>(() => {
    return pass.value && isTooShort()
        ? trans('password_min_length', config.MIN_PASS_LENGTH.toString())
        : ''
})

function isTooShort(): boolean {
    if (!props.withMinLength) {
        return false
    }

    return !pass.value || pass.value.length < config.MIN_PASS_LENGTH
}
</script>

<template>
    <Input
        v-model="pass"
        @loaded="emit('loaded', $event)"
        @keyup="emit('has-error', isTooShort())"
        type="password"
        :error="passErr || error"
        :with-button="withButton"
        :minlength="withMinLength ? config.MIN_PASS_LENGTH : undefined"
        :label
        :id
        :loading
    />
</template>
