<script setup lang="ts">
import type { Group, Folder, ExportSchema, ExportSchemaV1 } from '@common/types'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { logger, trans } from '@common/modules'
import { decryptExport } from '@common/modules/webCrypto'
import { fromBase64 } from '@common/modules/base64'
import { showToast } from '@common/modules/toast'
import { getDecryptionError } from '@/errors'
import { useAttemptsStore } from '@/stores/attempts'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import { useModalStore } from '@/stores/modal'
import { useProgressStore } from '@/stores/progress'
import pako from 'pako'
import Section from '@settings/components/Section.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import Progress from '@common/components/Progress.vue'
import { generateExportSchemaV1 } from '@common/modules/importExport'

const groupStore = useGroupStore()
const folderStore = useFolderStore()
const attemptsStore = useAttemptsStore()
const modalStore = useModalStore()
const progressStore = useProgressStore()

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

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
            await importFile(e.target.result as string)
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
    try {
        const decrypted = await decryptExport(encrypted, pass)
        await importFile(decrypted)
        attemptsStore.unlock()
    } catch (err) {
        showToast({ text: getDecryptionError(err), type: 'error' })
        return false
    }

    resetState()

    return true
}

async function importFile(rawData: string): Promise<void> {
    if (rawData.startsWith('algo(')) {
        await modalStore.show('password', {
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

    const json = JSON.parse(rawData) as ExportSchema

    if (json !== null && typeof json === 'object' && 'meta' in json) {
        await importNormalizedFile(json)
        return
    }

    const exportsWithoutFoldersVersion = 'v1.18.2'
    const groups = Array.isArray(json) ? json : [json]
    const schema = generateExportSchemaV1(groups, [], exportsWithoutFoldersVersion)

    await importNormalizedFile(schema)
}

async function importNormalizedFile(exportFile: ExportSchemaV1) {
    await groupStore.load()

    const folders = cloneDeep(exportFile.folders) as Folder[]
    const groups = cloneDeep(exportFile.groups) as Group[]

    await folderStore.createMany(folders)

    const shouldReplaceDuplicates = await shouldReplaceDuplicateGroups(groups)
    await groupStore.importMany(groups, shouldReplaceDuplicates)

    showSuccessMessage(groups)
}

async function shouldReplaceDuplicateGroups(groups: Group[]): Promise<boolean> {
    const duplicatesCount = groups.reduce((acc, group) => {
        return acc + groupStore.groups.filter(g => g.id === group.id).length
    }, 0)

    if (duplicatesCount === 0) {
        return false
    }

    const resp = await modalStore.show('confirm', {
        title: trans('some_groups_already_exist_same_name'),
    })

    return resp ? resp.isConfirmed : false
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
        <div class="flex flex-col gap-4">
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
