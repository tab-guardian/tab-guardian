<script setup lang="ts">
import type { Component } from 'vue'
import Tip from '@common/components/Tip.vue'

type Props = {
    label: string
    icon: Component
    disabled?: boolean
    tip?: string,
}

withDefaults(defineProps<Props>(), {
    disabled: false,
    tip: '',
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
        <span>{{ label }} <Tip v-if="tip" :tip /></span>
    </div>
</template>
