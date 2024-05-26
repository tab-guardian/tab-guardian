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

            <div class="w-full rounded-full h-1 bg-slate-300 dark:bg-slate-700">
                <div
                    class="bg-primary h-1 rounded-full bar"
                    :style="{ width: storageUsage + '%' }"
                ></div>
            </div>

            <small>
                {{ currentBytesUsage }} /
                {{ maxBytes.toLocaleString('fr-FR') }}
                {{ trans('bytes') }}
            </small>
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
