<script setup lang="ts">
import type { Component } from 'vue'

type Props = {
    label: string
    icon: Component
    disabled?: boolean
}

withDefaults(defineProps<Props>(), {
    disabled: false,
})
</script>

<template>
    <div
        :class="[
            'px-2 py-1.5 bg-page border border-border rounded-lg',
            'flex items-center gap-2 select-none',
            disabled ? ' opacity-50 ' : ' hover:border-primary hover:text-primary cursor-pointer ',
        ]"
    >
        <component :is="icon" width="22" height="22" />
        <span>{{ label }}</span>
    </div>
</template>
