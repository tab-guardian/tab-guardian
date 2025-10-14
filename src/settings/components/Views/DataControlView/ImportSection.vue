<script setup lang="ts">
import type { EncryptionAlgo, Group } from '@common/types'
import { ref } from 'vue'
import { trans } from '@common/modules/utils'
import { decryptString } from '@common/modules/webCrypto'
import { fromBase64 } from '@common/modules/utils'
import { showToast } from '@common/modules/toast'
import { getDecryptionError } from '@/errors'
import { useAttemptsStore } from '@/stores/attempts'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useProgressStore } from '@/stores/progress'
import pako from 'pako'
import Swal from 'sweetalert2'
import Section from '@settings/components/Section.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import Progress from '@common/components/Progress.vue'

const groupStore = useGroupStore()
const attemptsStore = useAttemptsStore()
const popupStore = usePopupStore()
const progressStore = useProgressStore()

const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

async function importGroups(): Promise<void> {
    if (!file.value) {
        showToast(trans('choose_file_import'), 'error')
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
            console.error(err)
            showToast(trans('error_reading_file'), 'error')
        }
    }

    reader.onerror = e => {
        console.error('Error reading file:', e)
        showToast(trans('error_reading_file'), 'error')
    }

    reader.readAsText(file.value)

    resetState()
}

async function requestPassword(rawData: string): Promise<void> {
    const algo = /^algo\(([A-z-]+)\)/.exec(rawData)?.[1] as
        | EncryptionAlgo
        | undefined

    if (!algo) {
        throw new Error('Cannot get the encryption algorithm from the file')
    }

    const encrypted = rawData.replace(`algo(${algo})`, '')

    popupStore.show('enterPassword', {
        decrypting: pass => decryptFile(encrypted, pass, algo),
        algo,
        description: trans('enter_pass_unlock_file'),
    })
}

async function decryptFile(
    encrypted: string,
    pass: string,
    algo: EncryptionAlgo,
): Promise<boolean> {
    try {
        const decrypted = await decryptString(encrypted, pass, algo)
        await processFileContent(decrypted)
        attemptsStore.unlock()
    } catch (err) {
        showToast(getDecryptionError(err), 'error')
        return false
    }

    resetState()

    return true
}

async function processFileContent(rawData: string): Promise<void> {
    if (rawData.startsWith('algo(')) {
        await requestPassword(rawData)
        return
    }

    const isCompressed = !rawData.startsWith('{') && !rawData.startsWith('[{')

    if (isCompressed) {
        const compressedBytes = fromBase64(rawData)
        rawData = pako.ungzip(compressedBytes, { to: 'string' })
    }

    const json = JSON.parse(rawData) as Group[] | Group
    const groups = Array.isArray(json) ? json : [json]

    await groupStore.loadGroupsFromStorage()

    const groupsWithSameName = groups.reduce((acc, group) => {
        return acc + groupStore.groups.filter(g => g.name === group.name).length
    }, 0)

    if (groupsWithSameName === 0) {
        await groupStore.addAndSaveGroups(groups, false)
        showSuccessMessage(groups)
        return
    }

    const answer = await Swal.fire({
        title: trans('replace_groups'),
        text: trans('some_groups_already_exist_same_name'),
        showDenyButton: true,
        confirmButtonText: trans('yes'),
        denyButtonText: trans('no'),
    })

    if (answer.isConfirmed) {
        await groupStore.addAndSaveGroups(groups, true)
        showSuccessMessage(groups)
    }
}

function showSuccessMessage(groups: Group[]): void {
    const msg = trans('groups_imported', groups.length.toString())
    showToast(msg)
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

            <Progress />
        </div>
    </Section>
</template>
