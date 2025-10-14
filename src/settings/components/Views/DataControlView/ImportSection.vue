<script setup lang="ts">
import type { EncryptionAlgo, Group } from '@common/types'
import { ref } from 'vue'
import { env } from '@common/env'
import { trans } from '@common/modules/utils'
import { useGroupStore } from '@/stores/group'
import { decryptString } from '@common/modules/webCrypto'
import { fromBase64 } from '@common/modules/utils'
import { useAttemptsStore } from '@/stores/attempts'
import { showToast } from '@common/modules/toast'
import { usePopupStore } from '@/stores/popup'
import { getDecryptionError } from '@/errors'
import pako from 'pako'
import Swal from 'sweetalert2'
import Section from '@settings/components/Section.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const groupStore = useGroupStore()
const attemptsStore = useAttemptsStore()
const { show: showPopup } = usePopupStore()

const fileRawData = ref<string>('')
const password = ref<string>('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const importing = ref<boolean>(false)
const isEncryptedFile = ref<boolean>(false)

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

async function handlePasswordSubmit(): Promise<void> {
    if (password.value.length < env.MIN_PASS_LENGTH) {
        const msg = trans('passwords_min_length', env.MIN_PASS_LENGTH.toString())
        showToast(msg, 'error')
        return
    }

    const rawData = fileRawData.value
    const algo = /^algo\(([A-z-]+)\)/.exec(rawData)?.[1] as
        | EncryptionAlgo
        | undefined

    if (!algo) {
        throw new Error('Cannot get the encryption algorithm from the file')
    }

    const attempt = await attemptsStore.makeAttempt()

    if (!attempt.success) {
        showToast(attempt.error, 'error', 5000)
        password.value = ''
        return
    }

    importing.value = true

    const encrypted = rawData.replace(`algo(${algo})`, '')

    try {
        const decrypted = await decryptString(encrypted, password.value, algo)
        await processFileContent(decrypted)
        attemptsStore.unlock()
        resetState()
    } catch (err) {
        showToast(getDecryptionError(err), 'error')
        importing.value = false
        password.value = ''
    }
}

async function processFileContent(rawData: string): Promise<void> {
    fileRawData.value = rawData

    if (rawData.startsWith('algo(')) {
        isEncryptedFile.value = true
        return
    }

    importing.value = true

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
        groupStore.addAndSaveGroups(groups, false)
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
    password.value = ''
    file.value = null
    importing.value = false
    fileRawData.value = ''
    isEncryptedFile.value = false

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
        </div>

        <form
            v-if="isEncryptedFile"
            @submit.prevent="handlePasswordSubmit"
            class="mt-5 mx-auto max-w-96"
        >
            <PasswordInput
                @loaded="inp => inp.focus()"
                v-model="password"
                id="enter-password"
                :label="trans('enter_pass')"
                :with-button="true"
                :loading="importing"
            />
        </form>
    </Section>
</template>
