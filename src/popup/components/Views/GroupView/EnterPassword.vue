<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import showToast from '@common/modules/showToast'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import Input from '@common/components/Form/Input.vue'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const { trans } = useTransStore()
const groupStore = useGroupStore()
const popupStore = usePopupStore()

const password = ref<string>('')

function submitPass(): void {
    if (!password.value) {
        showToast(trans('Enter a password'), 'error')
        return
    }

    // @todo: check if password matches
    // if (!settingsStore.passwordMatches(password.value)) {
    //     showToast(trans('Incorrect password'), 'error')
    //     return
    // }

    // With this, we don't need to type password to lock the
    // group after just unlocking it
    popupStore.popups.enterPassword.password = password.value

    groupStore.decryptGroup(props.group, password.value)
    showToast(trans('Group is unlocked'))

    password.value = ''
}
</script>

<template>
    <div class="bg-secondary p-3 rounded-md shadow-md mt-2">
        <p class="flex items-center gap-3 mb-2 text-sm leading-4">
            <ShieldCheckIcon width="45" height="45" />
            {{ trans('Enter a password to unlock the content of this group') }}
        </p>

        <form @submit.prevent="submitPass">
            <Input
                @loaded="inp => inp.focus()"
                v-model="password"
                :label="trans('Enter a password')"
                type="password"
                id="enter-password"
                :withButton="true"
            />
        </form>
    </div>
</template>
