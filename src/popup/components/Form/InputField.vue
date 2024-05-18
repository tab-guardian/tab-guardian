<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

type Emits = {
    (e: 'submit'): void
    (e: 'loaded', input: HTMLInputElement): void
}

type Props = {
    placeholder?: string
    type: 'password' | 'text' | 'email' | 'number'
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
    <form @submit.prevent="emit('submit')" class="flex items-center gap-2">
        <input
            :class="[
                'bg-page border border-border rounded-md text-sm h-9 px-2 w-full',
                'text-font focus:outline focus:outline-primary',
            ]"
            :type="props.type"
            :placeholder="props.placeholder"
            v-model="modelValue"
            ref="inputRef"
        />

        <button
            type="submit"
            :class="[
                'bg-private transition-colors w-14 h-9 rounded-md',
                'flex items-center justify-center cursor-pointer text-secondary',
                'hover:bg-private-hover',
            ]"
        >
            <CheckIcon width="20" height="20" />
        </button>
    </form>
</template>
