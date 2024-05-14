<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import Section from '@/components/Views/SettingsView/Sections/Section.vue'
import InputField from '@/components/Form/InputField.vue'
import showToast from '@/modules/showToast'

const { trans } = useTransStore()
const { updatePassword } = useSettingsStore()
const password = ref<string>('')

const subtitle = trans(
    'Choose a secret password for your private groups. Any time when you want to access a private group, you will need to enter this password',
)

function submitPass(): void {
    updatePassword(password.value)
    password.value = ''
    showToast(trans('Password has been set'))
}
</script>

<template>
    <Section :title="trans('Private Password')" :subtitle>
        <InputField
            type="password"
            :placeholder="trans('Enter password')"
            v-model="password"
            @submit="submitPass"
        />
    </Section>
</template>
