<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
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

    const groups = groupStore.groups.filter(group => !group.isPrivate)

    if (groups.length === 0) {
        showToast(trans('No groups to export'), 'error')
        return
    }

    const json = JSON.stringify(groups)

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-groups-export.json'
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
                'Export all of your tab groups. Keep in mind that private groups are not going to be exported. If you want to export them, you need to do it for each private group separately',
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
            {{ trans('Export') }}
        </Button>
    </Section>
</template>
