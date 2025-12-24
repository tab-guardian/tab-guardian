<script setup lang="ts">
import { trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import Modal from '@/components/Modals/Modal.vue'
import Button from '@common/components/Form/Button.vue'
import { onMounted, onUnmounted } from 'vue'

const modalStore = useModalStore()

const sharedData = modalStore.getSharedData('confirm')

onMounted(() => window.addEventListener('keydown', eventCallback))
onUnmounted(() => window.removeEventListener('keydown', eventCallback))

function eventCallback(e: KeyboardEvent): void {
    e.preventDefault()

    if (e.key === 'Enter') {
        handleConfirm()
    }

    if (e.key === 'Escape') {
        handleDeny()
    }
}

async function handleConfirm(): Promise<void> {
    modalStore.hide('confirm', { isConfirmed: true })
}

async function handleDeny(): Promise<void> {
    modalStore.hide('confirm', { isConfirmed: false })
}
</script>

<template>
    <Modal
        @cancel="handleDeny"
        :title="sharedData?.title || ''"
        :description="sharedData?.description"
    >
        <template #buttons>
            <Button @click="handleDeny" is="outline">
                {{ trans('no') }} <small>(Esc)</small>
            </Button>

            <Button @click="handleConfirm" is="success">
                {{ trans('yes') }} <small>(Enter)</small>
            </Button>
        </template>
    </Modal>
</template>
