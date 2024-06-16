<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import CryptoJS from 'crypto-js'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'

const { trans } = useTransStore()
const password = ref<string>('')
const groupStore = useGroupStore()

async function exportGroups(): Promise<void> {
    if (!password.value) {
        showToast(trans('Please enter a password to encrypt groups'), 'error')
        return
    }

    const groups = groupStore.groups

    if (groups.length === 0) {
        showToast(trans('No groups to export'), 'error')
        return
    }

    const json = JSON.stringify(groups)
    const data = CryptoJS.AES.encrypt(json, password.value).toString()
    const blob = new Blob([data])
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-groups-export'
    a.click()

    password.value = ''

    URL.revokeObjectURL(url)
}
</script>

<template>
    <Section
        :title="trans('Export Tab Groups')"
        :subtitle="
            trans(
                'Securely export all of your tab groups and encrypt them with a password',
            )
        "
    >
        <Input
            v-model="password"
            type="password"
            :label="trans('One time password')"
            :tip="trans('It will be used to encrypt the exported data')"
            id="export-password"
        />

        <Button @clicked="exportGroups" class="mt-4">
            <ArrowDownTrayIcon class="w-5 h-5" />
            {{ trans('Export everything') }}
        </Button>
    </Section>
</template>
