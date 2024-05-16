<script setup lang="ts">
import { onMounted } from 'vue'
import { useMainStore } from '@settings/stores/main'
import { useTransStore } from '@/stores/trans'
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

<style lang="sass"></style>
