<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type Props = {
    to?: RouteLocationRaw
}

const { to } = defineProps<Props>()

const className = [
    'w-7 h-7 flex items-center justify-center border border-transparent',
    'rounded-md color-font p-0.5 transition-all opacity-90',
    'hover:opacity-100 hover:border-border relative',
]
</script>

<template>
    <RouterLink v-if="to" :to :class="className">
        <slot />
    </RouterLink>

    <button type="button" v-else :class="className">
        <slot />
    </button>
</template>
