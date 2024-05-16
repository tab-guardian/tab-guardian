<script setup lang="ts">
import { onMounted } from 'vue'
import { useMainStore } from '@settings/stores/main'
import { useTransStore } from '@settings/stores/trans'
import PasswordSection from '@settings/components/PasswordSection.vue'
import OptionsSection from '@settings/components/OptionsSection.vue'

const { trans } = useTransStore()

const { loadSettingsFromStorage } = useMainStore()

onMounted(() => {
    loadSettingsFromStorage()
})
</script>

<template>
    <div class="container py-7">
        <h1 class="text-3xl">{{ trans('Settings') }}</h1>
        <p class="text-xl">
            {{ trans('Change the extension configurations here') }}
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
            <div>
                <PasswordSection />
            </div>

            <div>
                <OptionsSection />
            </div>
        </div>
    </div>
</template>

<style lang="sass">
@import '@settings/assets/sass/main'
</style>
