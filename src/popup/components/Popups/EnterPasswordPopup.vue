<script setup lang="ts">
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import showToast from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import Input from '@common/components/Form/Input.vue'

const { trans } = useTransStore()
const store = usePopupStore()

function submitPopup(): void {
    if (!store.popups.enterPassword.password) {
        showToast(trans('Password is empty'), 'error')
        return
    }

    store.submitPopup('enterPassword')
}

function closePopup(): void {
    store.resetGroups()
    store.closePopup('enterPassword')
}
</script>

<template>
    <AppearTransition>
        <Popup
            v-if="store.isOpenPopup('enterPassword')"
            @cancel="closePopup"
            :content="trans('Enter a password')"
        >
            <form @submit.prevent="submitPopup">
                <Input
                    v-model="store.popups.enterPassword.password"
                    :placeholder="trans('Enter a password')"
                    type="password"
                    id="group-password-popup"
                    :withButton="true"
                    @loaded="inp => inp.focus()"
                />
            </form>
        </Popup>
    </AppearTransition>
</template>
