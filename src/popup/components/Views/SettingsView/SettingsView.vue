<script setup lang="ts">
import { onMounted } from 'vue'
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import View from '@/components/Views/View.vue'
import PasswordSection from '@/components/Views/SettingsView/Sections/PasswordSection.vue'

const { trans } = useTransStore()
const { loadSettingsFromStorage } = useSettingsStore()

onMounted(() => loadSettingsFromStorage())
</script>

<template>
    <View
        :title="trans('Settings')"
        :subtitle="trans('Change the extension configurations here')"
    >
        <div class="settings">
            <PasswordSection />
        </div>
    </View>
</template>

<style lang="sass" scoped>
.settings
    margin-top: 8px
</style>
