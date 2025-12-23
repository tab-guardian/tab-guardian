<script setup lang="ts">
import { ref } from 'vue'
import { logger, trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import Modal from '@/components/Modals/Modal.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import PasswordInputs from '@/components/PasswordInputs.vue'

const modalStore = useModalStore()

const sharedData = modalStore.getSharedData('newPassword')

const pass = ref<string>('')
const confirmPass = ref<string>('')
const preventSubmit = ref<boolean>(true)

function updatePassword(): void {
    if (preventSubmit.value) {
        logger().info('Cannot submit because password error')
        return
    }

    modalStore.hide('newPassword', { newPass: pass.value })
}
</script>

<template>
    <Modal
        @cancel="modalStore.hide('newPassword', {})"
        :title="sharedData?.title || trans('enter_new_pass')"
    >
        <form @submit.prevent="updatePassword" class="flex flex-col gap-3">
            <PasswordInputs
                v-model:pass="pass"
                v-model:confirm="confirmPass"
                @loaded="el => el.focus()"
                @has-error="preventSubmit = $event"
            />

            <Button type="submit" :disabled="preventSubmit" :icon="ChevronRightIcon">
                {{ trans('confirm') }}
            </Button>
        </form>
    </Modal>
</template>
