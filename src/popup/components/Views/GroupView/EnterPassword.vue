<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useSettingsStore } from '@/stores/settings'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import InputField from '@/components/Form/InputField.vue'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const { trans } = useTransStore()
const settingsStore = useSettingsStore()
const { decryptGroup } = useGroupStore()

const password = ref<string>('')

function submitPass(): void {
    if (!password.value) {
        showToast(trans('Please enter a password'), 'error')
        return
    }

    if (!settingsStore.passwordMatches(password.value)) {
        showToast(trans('Incorrect password'), 'error')
        return
    }

    decryptGroup(props.group, settingsStore.settings.password)
    password.value = ''

    showToast(trans('Group is unlocked'))
}
</script>

<template>
    <div class="bg-secondary p-3 rounded-md shadow-md mt-2">
        <p class="flex items-center gap-3 mb-2 text-sm leading-4">
            <ShieldCheckIcon width="45" height="45" />
            {{ trans('Enter a password to unlock the content of this group') }}
        </p>

        <InputField
            @submit="submitPass"
            @loaded="inp => inp.focus()"
            v-model="password"
            :placeholder="trans('Enter a password')"
            type="password"
        />
    </div>
</template>
