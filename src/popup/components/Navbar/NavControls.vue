<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@/components/Icons/CogIcon.vue'
import { useModalStore } from '@/stores/useModalStore'
import { useSettingsStore } from '@/stores/useSettingsStore'

const { openModal } = useModalStore()
const { loadSettingsFromStorage } = useSettingsStore()

function open(): void {
    loadSettingsFromStorage()
    openModal('settings')
}
</script>

<template>
    <div class="controls">
        <Control @click="open">
            <CogIcon />
        </Control>
    </div>
</template>

<style scoped lang="sass">
.controls
    display: flex
    align-items: center
</style>
