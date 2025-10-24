<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { logger, trans } from '@common/modules'
import { decryptExport } from '@common/modules/webCrypto'
import { fromBase64 } from '@common/modules/base64'
import { showToast } from '@common/modules/toast'
import { getDecryptionError } from '@/errors'
import { useAttemptsStore } from '@/stores/attempts'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useProgressStore } from '@/stores/progress'
import { useCryptoStore } from '@/stores/crypto'
import pako from 'pako'
import Section from '@settings/components/Section.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import Progress from '@common/components/Progress.vue'

const groupStore = useGroupStore()
const attemptsStore = useAttemptsStore()
const popupStore = usePopupStore()
const progressStore = useProgressStore()
const cryptoStore = useCryptoStore()

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const groupPassword = ref<string | null>(null)

async function importGroups(): Promise<void> {
    if (!file.value) {
        showToast({ text: trans('choose_file_import'), type: 'error' })
        return
    }

    const reader = new FileReader()

    reader.onload = async e => {
        if (!e.target) {
            throw new Error('e.target is null for reader.onload()')
        }

        try {
            await processFileContent(e.target.result as string)
        } catch (err) {
            logger().error('Process file content', err)
            showToast({ text: trans('error_reading_file'), type: 'error' })
        }
    }

    reader.onerror = e => {
        logger().error('Reading file:', e)
        showToast({ text: trans('error_reading_file'), type: 'error' })
    }

    reader.readAsText(file.value)

    resetState()
}

async function decryptFile(encrypted: string, pass: string): Promise<boolean> {
    groupPassword.value = pass

    try {
        const decrypted = await decryptExport(encrypted, pass)
        await processFileContent(decrypted)
        attemptsStore.unlock()
    } catch (err) {
        showToast({ text: getDecryptionError(err), type: 'error' })
        return false
    }

    resetState()

    return true
}

async function processFileContent(rawData: string): Promise<void> {
    if (rawData.startsWith('algo(')) {
        await popupStore.show('password', {
            decrypting: pass => decryptFile(rawData, pass),
            text: trans('enter_pass_unlock_file'),
        })
        return
    }

    const isCompressed = !rawData.startsWith('{') && !rawData.startsWith('[{')

    if (isCompressed) {
        const compressedBytes = fromBase64(rawData)
        rawData = pako.ungzip(compressedBytes, { to: 'string' })
    }

    const json = JSON.parse(rawData) as Group[] | Group

    const groups = Array.isArray(json) ? json : [json]

    // Lock (encrypt) the private group
    if (groupPassword.value && groups.length === 1) {
        groups[0] = await cryptoStore.encryptGroup(groups[0], groupPassword.value)
    }

    await groupStore.loadGroupsFromStorage()

    const groupsWithSameName = groups.reduce((acc, group) => {
        return acc + groupStore.groups.filter(g => g.name === group.name).length
    }, 0)

    if (groupsWithSameName === 0) {
        await groupStore.saveMany(groups)
        showSuccessMessage(groups)
        return
    }

    const resp = await popupStore.show('confirm', {
        text: trans('some_groups_already_exist_same_name'),
    })

    if (resp) {
        await groupStore.saveMany(groups, resp.isConfirmed)
        showSuccessMessage(groups)
    }
}

function showSuccessMessage(groups: Group[]): void {
    showToast({
        text: trans('groups_imported', groups.length.toString()),
    })
}

async function fileChosen(f: File, elem: HTMLInputElement): Promise<void> {
    file.value = f
    fileInput.value = elem
    await importGroups()
}

function resetState(): void {
    file.value = null

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}
</script>

<template>
    <Section
        :title="trans('import_groups')"
        :subtitle="trans('import_private_and_open_groups')"
    >
        <div class="space-y-4">
            <FileInput
                @chosen="fileChosen"
                type="file"
                :label="file ? trans('file_chosen') : trans('choose_exported_file')"
                id="choose-file"
            />

            <Progress v-if="progressStore.loading" />
        </div>
    </Section>
</template>
