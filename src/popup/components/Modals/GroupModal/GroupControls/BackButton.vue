<script setup lang="ts">
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import Control from '@/components/Modals/GroupModal/GroupControls/Control.vue'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore';

const store = useGroupModalStore()

function toMainScreen(): void {
    store.reset()
}
</script>

<template>
    <Control @click="toMainScreen">
        <ChevronRightIcon style="transform: rotate(180deg); width: 100%" />
    </Control>
</template>