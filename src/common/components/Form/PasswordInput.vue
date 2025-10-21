<script setup lang="ts">
import { config } from '@common/config'
import { computed, onMounted } from 'vue'
import { trans } from '@common/modules'
import Input from '@common/components/Form/Input.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
    (e: 'hasError', has: boolean): void
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

onMounted(() => emit('hasError', !pass.value))

const pass = defineModel<string | null>()

const passErr = computed<string>(() => {
    if (!props.withMinLength) {
        return ''
    }

    return pass.value && pass.value.length < config.MIN_PASS_LENGTH
        ? trans('passwords_min_length', config.MIN_PASS_LENGTH.toString())
        : ''
})
</script>

<template>
    <Input
        v-model="pass"
        @loaded="emit('loaded', $event)"
        @keyup="emit('hasError', passErr !== '')"
        type="password"
        :error="passErr || error"
        :with-button="withButton"
        :minlength="withMinLength ? config.MIN_PASS_LENGTH : undefined"
        :label
        :id
        :loading
    />
</template>
