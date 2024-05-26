<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useAttemptsStore } from '@/stores/attempts'
import error from '@common/modules/error'
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
const attemptsStore = useAttemptsStore()

const password = ref<string>('')

function submitPass(): void {
    if (!password.value) {
        showToast(trans('Enter a password'), 'error')
        return
    }

    if (!attemptsStore.isAllowedToTry()) {
        password.value = ''
        return
    }

    // With this, we don't need to type password to lock the
    // group after just unlocking it
    popupStore.popups.enterPassword.passwords[props.group.id] = password.value

    try {
        groupStore.decryptGroup(props.group, password.value)
        attemptsStore.resetAttempts()
        showToast(trans('Group is unlocked'))
    } catch (e: any) {
        error.warn('Caught and handled error: ', e)

        if (e instanceof Error && e.message === 'Malformed UTF-8 data') {
            showToast(trans('Incorrect password'), 'error')
        } else {
            showToast(trans('Error ocurred'), 'error')
        }
    }

    password.value = ''
}
</script>

<template>
    <div class="px-2 mt-3">
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
