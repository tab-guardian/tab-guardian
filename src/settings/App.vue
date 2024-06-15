<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useTransStore } from '@/stores/trans'
import en from '@settings/locales/en.json'
import ru from '@settings/locales/ru.json'
import Spinner from '@/components/Spinner.vue'
import OptionsSection from '@settings/components/OptionsSection.vue'
import EraseSection from '@settings/components/EraseSection.vue'
import ExportSection from '@settings/components/ExportSection.vue'

const store = useSettingsStore()
const { trans, loadMessages } = useTransStore()

onBeforeMount(() => {
    loadMessages({ en, ru })
})

onMounted(() => {
    store.loadSettingsFromStorage()
})
</script>

<template>
    <div class="container py-7">
        <h1 class="text-4xl font-bold">{{ trans('Settings') }}</h1>
        <p class="text-xl">
            {{ trans('Change the extension configurations here') }}
        </p>

        <Spinner v-if="store.loading" />

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
            <OptionsSection />

            <div class="flex flex-col gap-4">
                <EraseSection />
                <ExportSection />
            </div>
        </div>
    </div>
</template>
