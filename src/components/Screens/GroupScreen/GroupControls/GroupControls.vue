<script setup lang="ts">
import { ScreenName } from '@/types'
import BackButton from '@/components/Screens/GroupScreen/GroupControls/BackButton.vue'
import { useScreenStore } from '@/stores/screenStore'
import { useTransStore } from '@/stores/transStore'

const screenStore = useScreenStore()
const { trans } = useTransStore()

function toMainScreen(): void {
    screenStore.selectedGroup = null
    screenStore.screen = ScreenName.Main
}
</script>

<template>
    <div class="controls">
        <BackButton @click="toMainScreen" />
    </div>
</template>

<style lang="sass" scoped>
.controls
    display: flex
    justify-content: space-between
</style>
