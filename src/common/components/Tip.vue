<script setup lang="ts">
type Props = {
    tip: string
}

defineProps<Props>()
</script>

<template>
    <span
        v-tippy="tip"
        :class="[
            'border rounded-full w-4 h-4 text-center ml-1 cursor-pointer inline-flex items-center',
            'justify-center border-gray-500 text-xs font-heading',
        ]"
    >
        ?
    </span>
</template>
