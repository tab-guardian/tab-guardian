<script setup lang="ts">
import { computed } from 'vue'

type Props = {
    current: number
    max: number
}

const props = defineProps<Props>()

const percent = computed<number>(() => {
    if (props.max === 0) {
        return 0
    }

    return Math.round((props.current / props.max) * 100)
})
</script>

<template>
    <div class="flex gap-2 items-center w-full">
        <div class="bg-secondary border border-border rounded-full relative overflow-hidden h-2 flex-1">
            <div class="bg-primary absolute left-0 inset-y-0 transition-all" :style="{ width: percent + '%' }"></div>
        </div>

        <small>{{ percent }}%</small>
    </div>
</template>
