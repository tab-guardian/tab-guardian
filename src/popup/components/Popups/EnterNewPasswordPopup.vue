<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import showToast from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import Input from '@common/components/Form/Input.vue'

const { trans } = useTransStore()
const store = usePopupStore()
const groupStore = useGroupStore()
const password = ref<string>('')
const groupId = computed<number | null>(() =>
    groupStore.selectedGroup ? groupStore.selectedGroup.id : null,
)

function submitPopup(): void {
    if (groupId.value && store.popups.enterPassword.passwords[groupId.value]) {
        store.submitPopup('enterPassword')
        return
    }

    showToast(trans('Password is empty'), 'error')
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
        <form @submit.prevent="submitPopup">
            <Input
                v-model="password"
                @input="setPassword"
                :placeholder="trans('Enter a password')"
                type="password"
                id="group-password-popup"
                :withButton="true"
                @loaded="inp => inp.focus()"
            />
        </form>
    </Popup>
</template>
