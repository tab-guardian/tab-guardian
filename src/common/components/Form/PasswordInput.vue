<script setup lang="ts">
import Input from '@common/components/Form/Input.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
}>()

type Props = {
    label: string
    id: string
    withButton?: boolean
    loading?: boolean
    error?: string | null
    minlength?: number
    maxlength?: number
}

withDefaults(defineProps<Props>(), {
    loading: false,
    withButton: false,
})

const modelValue = defineModel()
</script>

<template>
    <Input
        @loaded="el => emit('loaded', el)"
        type="password"
        v-model="modelValue"
        :label
        :id
        :withButton
        :loading
        :error
        :minlength
        :maxlength
    />
</template>
