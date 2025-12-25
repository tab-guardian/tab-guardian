<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { ref, onMounted } from 'vue'
import { trans, downloadFile } from '@common/modules'
import { showToast } from '@common/modules/toast'
import { useModalStore } from '@/stores/modal'
import { encryptExport } from '@common/modules/webCrypto'
import { toBase64 } from '@common/modules/base64'
import pako from 'pako'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const groupStore = useGroupStore()
const modalStore = useModalStore()

const exporting = ref<boolean>(false)
const usePassword = ref<boolean>(false)

onMounted(async () => await groupStore.load())

async function exportGroups(): Promise<void> {
    const groups = groupStore.groups

    if (groups.length === 0) {
        showToast({ text: trans('no_groups_export'), type: 'error' })
        return
    }

    exporting.value = true

    const json = JSON.stringify(groups)
    const compressed = toBase64(pako.gzip(json))

    if (!usePassword.value) {
        downloadFile(compressed, 'tab-groups-export')
        exporting.value = false
        return
    }

    const resp = await modalStore.show('newPassword', {})

    if (!resp || !resp.newPass) {
        exporting.value = false
        return
    }

    const encrypted = await encryptExport(compressed, resp.newPass)
    downloadFile(encrypted, 'tab-groups-export')
    exporting.value = false
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
