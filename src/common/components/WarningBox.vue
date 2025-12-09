<script setup lang="ts">
import { computed } from 'vue'
import ShieldExclamationIcon from '@common/components/Icons/ShieldExclamationIcon.vue'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'

type Props = {
    message: string
    success?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    success: false,
})

const boxClassName = computed<string>(() => {
    return props.success ? 'bg-safe' : 'bg-unsafe'
})
</script>

<template>
    <div
        class="flex items-center justify-between mb-4 mt-1 p-3 rounded-lg gap-3"
        :class="boxClassName"
    >
        <ShieldCheckIcon v-if="success" class="text-green-400 size-7 shrink-0" />

        <ShieldExclamationIcon v-else class="text-red-400 size-7 shrink-0" />

        <span class="text-sm w-full">{{ message }}</span>
        <slot />
    </div>
</template>
