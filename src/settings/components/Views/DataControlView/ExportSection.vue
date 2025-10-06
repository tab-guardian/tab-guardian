<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { ref, onMounted } from 'vue'
import { trans } from '@common/modules/trans'
import { showToast } from '@common/modules/showToast'
import { usePopupStore } from '@/stores/popup'
import { encryptString } from '@common/modules/webCrypto'
import { env } from "@common/env"
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const groupStore = useGroupStore()
const { openPopup } = usePopupStore()

const exporting = ref<boolean>(false)
const usePassword = ref<boolean>(false)

onMounted(async () => {
    await groupStore.loadGroupsFromStorage()
})

async function exportGroups(): Promise<void> {
    const groups = groupStore.groups

    if (groups.length === 0) {
        showToast(trans('no_groups_export'), 'error')
        return
    }

    exporting.value = true

    let jsonStr = JSON.stringify(groups)

    if (usePassword.value) {
        openPopup('newPassword', async (pass: string) => {
            jsonStr = await encryptJSON(jsonStr, pass)
            downloadFile(jsonStr)
        })

        return
    }

    openPopup('newPassword', async (pass: string) => {
        const encrypted = await encryptJSON(compressed, pass)
        downloadFile(encrypted)
    })
}

function downloadFile(jsonStr: string | Uint8Array): void {
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-groups-export.json'
    a.click()

    URL.revokeObjectURL(url)

    exporting.value = false
}

async function encryptJSON(json: string | Uint8Array, pass: string): Promise<string> {
    const encrypted = await encryptString(json, pass, env.CURR_ENCRYPT_ALGO)
    const header = `algo(${env.CURR_ENCRYPT_ALGO})`

    return `${header}${encrypted}`
}
</script>

<template>
    <Section
        :title="trans('export_tab_groups')"
        :subtitle="trans('export_tab_groups_desc')"
    >
        <SlideSwitch v-model="usePassword">
            {{ trans('protect_export_using_pass') }}
        </SlideSwitch>

        <Button
            @clicked="exportGroups"
            :icon="ArrowDownTrayIcon"
            :loading="exporting"
            class="mt-4"
        >
            {{ trans('export') }}
        </Button>
    </Section>
</template>
