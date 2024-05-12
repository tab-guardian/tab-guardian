<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import Section from '@/components/Views/SettingsView/Sections/Section.vue'
import InputField from '@/components/Form/InputField.vue'

const { trans } = useTransStore()
const settingsStore = useSettingsStore()

const subtitle = trans(
    'Choose a secret password for your private groups. Any time when you want to access a private group, you will need to enter this password',
)
</script>

<template>
    <Section :title="trans('Private Password')" :subtitle>
        <InputField
            type="password"
            :placeholder="trans('Enter password')"
            v-model="settingsStore.tempPassword"
            @submit="settingsStore.updatePassword"
        />
    </Section>
</template>
