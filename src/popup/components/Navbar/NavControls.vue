<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@/components/Icons/CogIcon.vue'
import { useSettingsModalStore } from '@/stores/modals/useSettingsModalStore'

const settingsModalStore = useSettingsModalStore()
</script>

<template>
    <div class="controls">
        <Control @click="settingsModalStore.openSettings">
            <CogIcon />
        </Control>
    </div>
</template>

<style scoped lang="sass">
.controls
    display: flex
    align-items: center
</style>
