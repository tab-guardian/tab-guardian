<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/showToast'
import Swal from 'sweetalert2'
import Section from '@settings/components/Section.vue'
import FileInput from '@common/components/Form/FileInput.vue'

const password = ref<string>('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const groupStore = useGroupStore()

async function importGroups(): Promise<void> {
    if (!file.value) {
        showToast(trans('choose_file_import'), 'error')
        return
    }

    const reader = new FileReader()

    reader.onload = async e => {
        try {
            const rawData = e.target?.result as string
            const json = JSON.parse(rawData) as Group[] | Group

            await prependGroups(Array.isArray(json) ? json : [json])
        } catch (err) {
            console.error(err)
            showToast(trans('failed_decrypt_file'), 'error')
        }
    }

    reader.onerror = e => {
        console.error('Error reading file:', e)
        showToast(trans('error_reading_file'), 'error')
    }

    reader.readAsText(file.value)
    password.value = ''
    file.value = null

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

async function prependGroups(groups: Group[]): Promise<void> {
    await groupStore.loadGroupsFromStorage()

    const groupsWithSameName = groups.reduce((acc, group) => {
        return acc + groupStore.groups.filter(g => g.name === group.name).length
    }, 0)

    if (groupsWithSameName === 0) {
        groupStore.addGroups(groups, false)
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
        await groupStore.addGroups(groups, true)
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
</script>

<template>
    <Section
        :title="trans('import_groups')"
        :subtitle="trans('import_private_public_groups')"
    >
        <div class="space-y-4">
            <FileInput
                @chosen="fileChosen"
                type="file"
                :label="file ? trans('file_chosen') : trans('choose_exported_file')"
                id="choose-file"
            />
        </div>
    </Section>
</template>
