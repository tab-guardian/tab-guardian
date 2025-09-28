<script setup lang="ts">
import SmallSpinner from '@common/components/SmallSpinner.vue'
import PlusIcon from '@common/components/Icons/PlusIcon.vue'

type Emits = {
    (e: 'clicked'): void
}

const emit = defineEmits<Emits>()

type Props = {
    loading?: boolean
}

withDefaults(defineProps<Props>(), {
    loading: false,
})
</script>

<template>
    <div class="text-right">
        <button
            type="button"
            @click="emit('clicked')"
            :disabled="loading"
            :class="[
                'bg-primary text-secondary px-4 py-2 rounded-md text-sm',
                'inline-flex items-center gap-2 transition-colors',
                loading ? ' opacity-50 pointer-events-none' : 'hover:bg-primary-hover',
            ]"
        >
            <slot />
            <SmallSpinner v-if="loading" width="20" height="20" />
            <PlusIcon v-else width="20" height="20" />
        </button>
    </div>
</template>
