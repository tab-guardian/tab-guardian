<script setup lang="ts">
import { ref, watchEffect } from 'vue'

type Props = {
    label: string
    id: string
    type: 'text' | 'password'
    class?: string
}

type Emits = {
    (e: 'loaded', input: HTMLInputElement): void
}

const emit = defineEmits<Emits>()

const inputRef = ref<HTMLInputElement | null>(null)
const props = defineProps<Props>()
const modelValue = defineModel()

watchEffect(() => {
    if (inputRef.value) {
        emit('loaded', inputRef.value)
    }
})
</script>

<template>
    <label :for="props.id" class="block mb-0.5 mx-1 text-sm">
        {{ props.label }}
    </label>

    <input
        :id="props.id"
        :type="props.type"
        class="rounded-lg px-3 py-2 w-full bg-page border border-border focus:outline outline-2 outline-primary"
        :class="props.class"
        v-model="modelValue"
        ref="inputRef"
        :placeholder="props.label"
    />
</template>
