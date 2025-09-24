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
        <div class="w-full rounded-full h-1 bg-slate-300 dark:bg-slate-700">
            <div
                class="bg-primary h-1 rounded-full shadow-[0_0_10px_2px_rgba(59,130,246,1)]"
                :style="{ width: percent + '%' }"
            ></div>
        </div>

        <small>{{ percent }}%</small>
    </div>
</template>
