<script setup lang="ts">
import Section from '@/components/Modals/SettingsModal/Sections/Section.vue'
import { useTransStore } from '@/stores/useTransStore'

const { trans } = useTransStore()
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
        />
    </Section>
</template>

<style lang="sass" scoped></style>
