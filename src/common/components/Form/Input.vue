<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Tip from '@common/components/Tip.vue'

type Props = {
    id: string
    type: 'text' | 'password'
    meta?: string
    class?: string
    tip?: string
    label?: string
    withButton?: boolean
    placeholder?: string
    maxlength?: number
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
        <div class="flex justify-between gap-2 items-center">
            <div class="flex gap-1">
                <label
                    v-if="label"
                    :for="props.id"
                    class="block mb-0.5 mx-1 text-sm"
                >
                    {{ props.label }}
                </label>

                <Tip v-if="props.tip" :tip="props.tip" />
            </div>

            <small v-if="props.meta" class="text-font-gray">
                {{ props.meta }}
            </small>
        </div>

        <div class="flex items-center gap-2">
            <input
                :id="props.id"
                :type="props.type"
                class="rounded-md px-2.5 py-1.5 w-full bg-page border border-border focus:outline outline-2 outline-primary"
                :class="props.class"
                v-model="modelValue"
                ref="inputRef"
                :placeholder="props.placeholder || props.label || ''"
                :maxlength="props.maxlength"
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
