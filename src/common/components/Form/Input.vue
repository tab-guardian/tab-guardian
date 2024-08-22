<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import Tip from '@common/components/Tip.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const props = defineProps<{
    id: string
    type: 'text' | 'password'
    meta?: string
    class?: string
    tip?: string
    label?: string
    withButton?: boolean
    placeholder?: string
    maxlength?: number
    error?: string | null
}>()

const modelValue = defineModel()

const className = computed(() => {
    return [
        'rounded-md px-2.5 py-1.5 w-full bg-page border focus:outline',
        props.class,
        props.error
            ? 'border-red-600 outline-red-600'
            : 'border-border outline-primary outline-2',
    ]
})

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
                <label v-if="label" :for="id" class="block mb-0.5 mx-1 text-sm">
                    {{ label }}
                </label>

                <Tip v-if="tip" :tip="tip" />
            </div>

            <small v-if="meta" class="text-font-gray">
                {{ meta }}
            </small>
        </div>

        <div class="flex items-center gap-2">
            <div class="w-full">
                <input
                    :id="id"
                    :type="type"
                    :class="className"
                    v-model="modelValue"
                    ref="inputRef"
                    :placeholder="placeholder || label || ''"
                    :maxlength
                    autocomplete="off"
                    autocapitalize="off"
                />

                <small v-if="error" class="text-red-600 block mt-0.5">
                    {{ error }}
                </small>
            </div>

            <button
                v-if="withButton"
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
