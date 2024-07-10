<script setup lang="ts">
import type { Group, Link } from '@/types'
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import decryptGroup from '@common/modules/encrypt/decryptGroup'
import CryptoJS, { enc } from 'crypto-js'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import FileInput from '@common/components/Form/FileInput.vue'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const { trans } = useTransStore()
const password = ref<string>('')
const file = ref<File | null>(null)
const groupStore = useGroupStore()
const isPrivate = ref<boolean>(false)
const replaceGroups = ref<boolean>(false)

async function importGroups(): Promise<void> {
    if (!file.value) {
        showToast(trans('Please choose a file to import'), 'error')
        return
    }

    const reader = new FileReader()

    reader.onload = async e => {
        try {
            const rawData = e.target?.result as string
            const json = JSON.parse(rawData)

            isPrivate.value = typeof json === 'object' && !Array.isArray(json)

            // if (!password.value) {
            //     showToast(
            //         trans('Please enter a password to decrypt groups'),
            //         'error',
            //     )
            //     return
            // }

            console.log(json)
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
}

function decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, password.value)
    return decodeURIComponent(bytes.toString(enc.Utf8))
}
</script>

<template>
    <Section
        :title="trans('Import Tab Groups')"
        :subtitle="trans('Import private or public tab groups')"
    >
        <div class="space-y-4">
            <FileInput
                @chosen="(f: File) => (file = f)"
                type="file"
                :label="trans('Choose the exported file')"
                id="choose-file"
            />

            <!-- <SlideSwitch v-model="replaceGroups">
                {{ trans('I want to replace all my groups with new ones') }}
            </SlideSwitch> -->

            <Input
                v-if="isPrivate"
                v-model="password"
                type="password"
                :label="trans('One time password')"
                :tip="trans('It is used to decrypt the exported data from a file')"
                id="import-password"
            />

            <Button @clicked="importGroups" class="mt-4">
                <ArrowDownTrayIcon class="w-5 h-5 rotate-180" />
                {{ trans('Import') }}
            </Button>
        </div>
    </Section>
</template>
