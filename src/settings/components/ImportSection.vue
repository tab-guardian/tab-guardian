<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import trans from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import Swal from 'sweetalert2'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'

const password = ref<string>('')
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const groupStore = useGroupStore()

async function importGroups(): Promise<void> {
    if (!file.value) {
        showToast(trans('Please choose a file to import'), 'error')
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
            showToast(trans('Failed to decrypt the file'), 'error')
        }
    }

    reader.onerror = e => {
        console.error('Error reading file:', e)
        showToast(trans('Error reading file'), 'error')
    }

    reader.readAsText(file.value)
    password.value = ''
    file.value = null

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

async function prependGroups(groups: Group[]): Promise<void> {
    const groupsWithSameName = groups.reduce((acc, group) => {
        return acc + groupStore.groups.filter(g => g.name === group.name).length
    }, 0)

    if (groupsWithSameName === 0) {
        groupStore.addGroups(groups, false)
        showSuccessMessage(groups)
        return
    }

    const answer = await Swal.fire({
        title: trans('Replace groups?'),
        text: trans(
            'Some groups that you want to import already exist with the same name. Do you want to replace them?',
        ),
        showDenyButton: true,
        confirmButtonText: trans('Yes'),
        denyButtonText: trans('No'),
    })

    if (answer.isConfirmed) {
        await groupStore.addGroups(groups, true)
        showSuccessMessage(groups)
    }
}

function showSuccessMessage(groups: Group[]): void {
    const msg = trans(':n groups imported successfully', groups.length.toString())
    showToast(msg)
}

function fileChosen(f: File, elem: HTMLInputElement): void {
    file.value = f
    fileInput.value = elem
}
</script>

<template>
    <Section
        :title="trans('Import Tab Groups')"
        :subtitle="trans('Import private or public tab groups')"
    >
        <div class="space-y-4">
            <FileInput
                @chosen="fileChosen"
                type="file"
                :label="trans(file ? 'File chosen' : 'Choose the exported file')"
                id="choose-file"
            />

            <Button @clicked="importGroups" class="mt-4" :disabled="!file">
                <ArrowDownTrayIcon class="w-5 h-5 rotate-180" />
                {{ trans('Import') }}
            </Button>
        </div>
    </Section>
</template>
