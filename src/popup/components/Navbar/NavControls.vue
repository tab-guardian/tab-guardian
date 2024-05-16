<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import isDevelopment from '@common/modules/isDevelopment'

async function openSettings(): Promise<void> {
    if (isDevelopment()) {
        window.open('settings.html')
        return
    }

    const tab = await chrome.tabs.create({
        url: chrome.runtime.getURL('settings.html'),
        active: true,
    })

    // focus on the window
    if (tab.id) {
        chrome.windows.update(tab.windowId, { focused: true })
    }
}
</script>

<template>
    <div class="controls">
        <Control @click="openSettings">
            <CogIcon />
        </Control>
    </div>
</template>

<style scoped lang="sass">
.controls
    display: flex
    align-items: center
</style>
