<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@/stores/useTransStore'
import { useSettingsModalStore } from '@/stores/modals/useSettingsModalStore'
import Section from '@/components/Modals/SettingsModal/Sections/Section.vue'

const { trans } = useTransStore()
const store = useSettingsModalStore()

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
            v-model="store.tempPassword"
            @blur="store.updatePassword"
        />
    </Section>
</template>

<style lang="sass" scoped></style>
