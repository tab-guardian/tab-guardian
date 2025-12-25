<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import Tip from '@common/components/Tip.vue'
import ArrowRightIcon from '@common/components/Icons/ArrowRightIcon.vue'
import Button from '@common/components/Form/Button.vue'

const emit = defineEmits<{
    (e: 'loaded', input: HTMLInputElement): void
}>()

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
    minlength?: number
    error?: string | null
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    withButton: false,
})

const modelValue = defineModel()
const inputRef = ref<HTMLInputElement | null>(null)

const className = computed(() => {
    return [
        'rounded-md px-2.5 py-1.5 w-full bg-page border',
        props.class,
        props.error
            ? 'border-red-600 outline-red-600'
            : 'border-border focus:outline-primary focus:outline-2',
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

                <Tip v-if="tip" :tip />
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
                    :disabled="loading"
                    :maxlength
                    :minlength
                    autocomplete="off"
                    autocapitalize="off"
                />

                <small v-if="error" class="text-red-600 block mt-1">
                    {{ error }}
                </small>
            </div>

            <Button
                v-if="withButton"
                type="submit"
                :loading
                is="success"
                :icon="ArrowRightIcon"
            />
        </div>
    </div>
</template>
