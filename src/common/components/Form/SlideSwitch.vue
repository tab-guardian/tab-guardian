<script setup lang="ts">
import { watch } from 'vue'

const emit = defineEmits<{
    (e: 'changed', checked: boolean): void
}>()

defineProps<{
    disabled?: boolean
    warning?: string | null
    description?: string | null
}>()

const modelValue = defineModel()

watch(modelValue, () => {
    emit('changed', modelValue.value as boolean)
})
</script>

<template>
    <label class="relative inline-flex items-center p-1">
        <input
            type="checkbox"
            class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
            v-model="modelValue"
            :disabled="disabled"
        />

        <span
            :class="[
                disabled ? 'opacity-50' : '',
                'w-10 h-6 flex items-center flex-shrink-0 p-1 dark:bg-zinc-600',
                'duration-300 ease-in-out peer-checked:bg-private after:w-4 after:h-4',
                'after:bg-white after:rounded-full after:shadow-sm after:duration-300',
                'peer-checked:after:translate-x-4 border border-border bg-zinc-200 rounded-full',
            ]"
        ></span>

        <small class="text-sm text-font-gray ml-3">
            <slot />

            <span v-if="description" class="opacity-75 block text-xs">
                {{ description }}
            </span>
            <span
                v-if="warning"
                class="dark:text-red-300 text-red-500 block text-xs"
            >
                {{ warning }}
            </span>
        </small>
    </label>
</template>
