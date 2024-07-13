<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import Input from '@common/components/Form/Input.vue'
import Button from '@common/components/Form/Button.vue'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'

const { trans } = useTransStore()
const store = usePopupStore()
const groupStore = useGroupStore()
const password = ref<string>('')
const confirmPassword = ref<string>('')
const groupId = computed<number | null>(() =>
    groupStore.selectedGroup ? groupStore.selectedGroup.id : null,
)

const passwordErr = computed<string>(() => {
    if (!groupId.value) {
        return ''
    }

    const pass = store.popups.enterPassword.passwords[groupId.value]

    return pass && pass !== confirmPassword.value
        ? trans('Passwords do not match')
        : ''
})

function submitPopup(): void {
    if (!groupId.value || !store.popups.enterPassword.passwords[groupId.value]) {
        showToast(trans('Password is empty'), 'error')
        return
    }

    if (passwordErr.value) {
        return
    }

    store.submitPopup('enterPassword')
}

function closePopup(): void {
    store.resetGroups()
    store.closePopup('enterPassword')
}

function setPassword(): void {
    store.popups.enterPassword.passwords[groupId.value!] = password.value
}
</script>

<template>
    <Popup @cancel="closePopup" :content="trans('Enter a password')">
        <form @submit.prevent="submitPopup" class="space-y-3">
            <Input
                v-if="groupId"
                v-model="password"
                @input="setPassword"
                :label="trans('Enter a password')"
                type="password"
                id="group-password-popup"
                @loaded="inp => inp.focus()"
            />

            <Input
                v-model="confirmPassword"
                type="password"
                id="group-confirm-password"
                :label="trans('Repeat password')"
                :error="passwordErr"
            />

            <Button type="submit" :disabled="!!passwordErr || !password">
                <LockClosedIcon width="20" height="20" />
                {{ trans('Lock the group') }}
            </Button>
        </form>
    </Popup>
</template>
