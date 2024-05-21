<script setup lang="ts">
import { onMounted } from 'vue'
import { useMainStore } from '@settings/stores/main'
import { useTransStore } from '@settings/stores/trans'
import Spinner from '@/components/Spinner.vue'
import OptionsSection from '@settings/components/OptionsSection.vue'
import EraseSection from '@settings/components/EraseSection.vue'

const { trans } = useTransStore()

const store = useMainStore()

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
            <EraseSection />
        </div>
    </div>
</template>
