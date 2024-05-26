<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import getImageURL from '@common/modules/getImageURL'
import isDevelopment from '@common/modules/isDevelopment'
import getLocalStorageUsage from '@common/modules/storage/getLocalStorageUsage'

onMounted(setCurrentBytesUsage)

const { trans } = useTransStore()
const currentBytesUsage = ref<number | null>(null)
const maxBytes = isDevelopment() ? 102400 : chrome.storage.local.QUOTA_BYTES

const storageUsage = computed(() => {
    if (currentBytesUsage.value === null) {
        return 0
    }

    return (currentBytesUsage.value / maxBytes) * 100
})

async function setCurrentBytesUsage(): Promise<void> {
    if (isDevelopment()) {
        currentBytesUsage.value = getLocalStorageUsage()
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

        <ul v-if="currentBytesUsage !== null" class="ml-3 w-36">
            <h2 class="mb-1">{{ trans('Storage usage') }}:</h2>

            <div
                class="w-full rounded-full h-2 bg-slate-300 dark:bg-slate-700 overflow-hidden"
            >
                <div
                    class="bg-primary h-2 rounded-l-full"
                    :style="{ width: storageUsage + '%' }"
                ></div>
            </div>

            <small>{{ currentBytesUsage }} / {{ maxBytes }} bytes</small>
        </ul>
    </div>
</template>
