<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Props = {
    to?: RouteLocationRaw
}

const { to } = defineProps<Props>()

const classes = [
    'w-7 h-7 flex items-center justify-center border border-transparent',
    'rounded-md color-font p-0.5 transition-all opacity-90',
    'hover:opacity-100 hover:border-border',
]
</script>

<template>
    <RouterLink v-if="to" :to :class="classes">
        <slot />
    </RouterLink>

    <button type="button" v-else :class="classes">
        <slot />
    </button>
</template>
