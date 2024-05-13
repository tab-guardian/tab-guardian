<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import View from '@/components/Views/View.vue'
import PasswordSection from '@/components/Views/SettingsView/Sections/PasswordSection.vue'

const { trans } = useTransStore()
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
