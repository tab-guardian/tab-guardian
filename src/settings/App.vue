<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { trans } from '@common/modules/trans'
import Spinner from '@/components/Spinner.vue'
import OptionsSection from '@settings/components/OptionsSection.vue'
import EraseSection from '@settings/components/EraseSection.vue'
import ExportSection from '@settings/components/ExportSection.vue'
import ImportSection from '@settings/components/ImportSection.vue'

const store = useSettingsStore()

onMounted(() => {
    store.loadSettingsFromStorage()
})
</script>

<template>
    <div class="container py-7">
        <h1 class="text-4xl font-bold">{{ trans('settings') }}</h1>
        <p class="text-xl">
            {{ trans('change_the_conf_here') }}
        </p>

        <Spinner v-if="store.loading" />

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
            <div class="flex flex-col gap-4">
                <OptionsSection />
            </div>

            <div class="flex flex-col gap-4">
                <EraseSection />
                <ExportSection />
                <ImportSection />
            </div>
        </div>
    </div>
</template>
