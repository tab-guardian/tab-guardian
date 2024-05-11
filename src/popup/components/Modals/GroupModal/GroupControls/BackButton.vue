<script setup lang="ts">
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import Control from '@/components/Control.vue'
import { useGroupStore } from '@/stores/useGroupStore'

const store = useGroupStore()

function toMainScreen(): void {
    store.reset()
}
</script>

<template>
    <Control @click="toMainScreen">
        <ChevronRightIcon style="transform: rotate(180deg); width: 100%" />
    </Control>
</template>
