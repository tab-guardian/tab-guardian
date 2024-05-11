<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import Section from '@/components/Modals/SettingsModal/Sections/Section.vue'

const { trans } = useTransStore()
const settingsStore = useSettingsStore()

const subtitle = trans(
    'Choose a secret password for your private groups. Any time when you want to access a private group, you will need to enter this password',
)
</script>

<template>
    <Section :title="trans('Private Password')" :subtitle>
        <input
            type="password"
            class="input"
            :placeholder="trans('Enter password')"
            v-model="settingsStore.tempPassword"
            @blur="settingsStore.updatePassword"
            @keydown.enter="settingsStore.updatePassword"
        />
    </Section>
</template>

<style lang="sass" scoped></style>
