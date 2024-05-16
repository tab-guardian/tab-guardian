<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import isDevelopment from '@/modules/isDevelopment'

function openSettings(): void {
    if (isDevelopment()) {
        window.open('settings.html')
        return
    }

    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') })
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
