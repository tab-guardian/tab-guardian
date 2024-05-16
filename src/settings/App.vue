<script setup lang="ts">
import { onMounted } from 'vue'
import { useMainStore } from '@settings/stores/main'
import { useTransStore } from '@settings/stores/trans'
import PasswordSection from '@settings/components/PasswordSection.vue'

const { trans } = useTransStore()

const { loadSettingsFromStorage } = useMainStore()

onMounted(() => {
    loadSettingsFromStorage()
})
</script>

<template>
    <div class="settings">
        <h1>{{ trans('Settings') }}</h1>
        <p>{{ trans('Change the extension configurations here') }}</p>

        <div>
            <PasswordSection />
        </div>
    </div>
</template>

<style lang="sass">
@import '@settings/assets/sass/main'

h1
    margin: 0 0 3px 0

p
    margin: 0 0 12px 0
</style>
