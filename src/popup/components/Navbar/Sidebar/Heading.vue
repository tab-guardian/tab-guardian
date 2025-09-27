<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { trans } from '@common/modules/trans'
import { getImageURL } from '@common/modules/browser/url'
import { getBytesInUse, getMaxBytes } from '@common/modules/storage'
import ProgressBar from '@common/components/ProgressBar.vue'


onMounted(async () => {
    currentBytesUsage.value = await getBytesInUse()
})

const currentBytesUsage = ref<number | null>(null)
const maxBytes = getMaxBytes()

const storageUsage = computed(() => {
    if (currentBytesUsage.value === null) {
        return 0
    }

    return (currentBytesUsage.value / maxBytes) * 100
})
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

