<script setup lang="ts">
import { ref, watchEffect } from 'vue'

type Props = {
    label: string
    id: string
    type: 'text' | 'password'
    class?: string
    withButton?: boolean
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
    <div>
        <label :for="props.id" class="block mb-0.5 mx-1 text-sm">
            {{ props.label }}
        </label>

        <div class="flex items-center gap-3">
            <input
                :id="props.id"
                :type="props.type"
                class="rounded-lg px-2.5 py-1.5 w-full bg-page border border-border focus:outline outline-2 outline-primary"
                :class="props.class"
                v-model="modelValue"
                ref="inputRef"
                :placeholder="props.label"
            />

            <button
                v-if="props.withButton"
                type="submit"
                :class="[
                    'bg-private transition-colors w-14 h-9 rounded-md',
                    'flex items-center justify-center cursor-pointer text-secondary',
                    'hover:bg-private-hover',
                ]"
            >
                <span aria-hidden="true" aria-describedby="Enter">⏎</span>
            </button>
        </div>
    </div>
</template>