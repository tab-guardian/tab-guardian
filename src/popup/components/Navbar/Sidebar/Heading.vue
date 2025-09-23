<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { trans } from '@common/modules/trans'
import { getImageURL } from '@common/modules/browser/url'
import { isDevelopment } from '@common/modules/isDevelopment'
import { isFirefox } from '@common/modules/browser/isFirefox'
import { getLocalStorageUsage } from '@common/modules/storage/getLocalStorageUsage'

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
            <h2 class="mb-1 text-sm">
                {{ trans('storage_usage') }} {{ storageUsage.toFixed(2) }}%
            </h2>

            <div class="w-full rounded-full h-1 bg-slate-300 dark:bg-slate-700">
                <div
                    class="bg-primary h-1 rounded-full bar"
                    :style="{ width: storageUsage + '%' }"
                ></div>
            </div>
        </ul>
    </div>
</template>

<style scoped>
.bar {
    box-shadow: 0 0 10px 2px rgba(59, 130, 246, 1);
    animation: glow 1.5s infinite;
}

@keyframes glow {
    0%,
    100% {
        box-shadow: 0 0 10px 2px rgba(59, 130, 246, 1);
    }
    50% {
        box-shadow: 0 0 10px 4px rgba(59, 130, 246, 0.6);
    }
}
</style>
