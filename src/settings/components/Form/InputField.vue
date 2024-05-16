<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

type Emits = {
    (e: 'submit'): void
    (e: 'loaded', input: HTMLInputElement): void
}

type Props = {
    placeholder?: string
    type: 'password' | 'text' | 'number'
}

const inputRef = ref<HTMLInputElement | null>(null)

const emit = defineEmits<Emits>()
const props = defineProps<Props>()
const modelValue = defineModel()

watchEffect(() => {
    if (inputRef.value) {
        emit('loaded', inputRef.value)
    }
})
</script>

<template>
    <form @submit.prevent="emit('submit')" class="form">
        <input
            class="input"
            :type="props.type"
            :placeholder="props.placeholder"
            v-model="modelValue"
            ref="inputRef"
        />

        <button type="submit">
            <CheckIcon width="20" height="20" />
        </button>
    </form>
</template>
