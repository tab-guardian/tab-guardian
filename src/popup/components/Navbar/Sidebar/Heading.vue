<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { trans } from '@common/modules'
import { runtime } from '@common/modules/runtime'
import { formatNumber } from '@common/modules'
import ProgressBar from '@common/components/ProgressBar.vue'

onMounted(async () => {
    currentBytesUsage.value = await runtime.storage.getBytesInUse()
})

const currentBytesUsage = ref<number | null>(null)
const maxBytes = runtime.storage.MAX_BYTES_QUOTA

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
            :src="runtime.getUrl('images/icons/icon-128.png')"
            class="absolute top-1/2 -translate-y-1/2 -right-14 drop-shadow-md"
        />

        <ul v-if="currentBytesUsage !== null" class="ml-3 w-40 mt-8">
            <h2 class="mb-1 text-md">{{ trans('storage_usage') }}</h2>

            <ul class="text-xs mt-1 mb-2">
                <li>
                    Used:
                    <b class="text-primary">{{
                        formatNumber(currentBytesUsage / 1024)
                    }}</b>
                    KB
                </li>
                <li>
                    Max: &nbsp;<b class="text-primary">{{
                        formatNumber(maxBytes / 1024)
                    }}</b>
                    KB
                </li>
            </ul>

            <ProgressBar :current="storageUsage" :max="100" />
        </ul>
    </div>
</template>
