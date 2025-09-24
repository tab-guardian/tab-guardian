<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { trans } from '@common/modules/trans'
import { getImageURL } from '@common/modules/browser/url'
import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'
import { getLocalStorageUsage } from '@common/modules/storage'
import ProgressBar from '@common/components/ProgressBar.vue'

const LOCAL_STORAGE_QUOTA_BYTES = 5_242_880
const FIREFOX_QUOTA_BYTES = 5_242_880

onMounted(setCurrentBytesUsage)

const currentBytesUsage = ref<number | null>(null)
const maxBytes = getMaxBytes()

const storageUsage = computed(() => {
    if (currentBytesUsage.value === null) {
        return 0
    }

    return (currentBytesUsage.value / maxBytes) * 100
})

function getMaxBytes(): number {
    if (isDevelopment()) {
        return LOCAL_STORAGE_QUOTA_BYTES
    }

    return isFirefox() ? FIREFOX_QUOTA_BYTES : chrome.storage.local.QUOTA_BYTES
}

async function setCurrentBytesUsage(): Promise<void> {
    if (isDevelopment()) {
        currentBytesUsage.value = getLocalStorageUsage()
        return
    }

    if (isFirefox()) {
        const storageData = await browser.storage.local.get()
        const entries = Object.entries(storageData)
            .map(([key, value]) => key + JSON.stringify(value))
            .join('')

        currentBytesUsage.value = new TextEncoder().encode(entries).length
        return
    }

    currentBytesUsage.value = await chrome.storage.local.getBytesInUse()
}
</script>

<template>
    <div
        class="flex items-center h-36 bg-slate-200 dark:bg-slate-800 relative overflow-hidden"
    >
        <img
            :src="getImageURL('icons/icon-128.png')"
            class="absolute top-1/2 -translate-y-1/2 -right-14 drop-shadow-md"
        />

        <ul v-if="currentBytesUsage !== null" class="ml-3 w-40 mt-16">
            <h2 class="mb-1 text-sm">{{ trans('storage_usage') }}</h2>
            <ProgressBar :current="storageUsage" :max="100" />
        </ul>
    </div>
</template>

