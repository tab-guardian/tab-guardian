<script setup lang="ts">
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import { onMounted, onUnmounted } from 'vue'

const popupStore = usePopupStore()

const sharedData = popupStore.getSharedData('confirm')

onMounted(() => window.addEventListener('keydown', eventCallback))
onUnmounted(() => window.removeEventListener('keydown', eventCallback))

function eventCallback(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
        handleConfirm()
    }

    if (e.key === 'Escape') {
        handleDeny()
    }
}

async function handleConfirm(): Promise<void> {
    popupStore.hide('confirm', { isConfirmed: true })
}

async function handleDeny(): Promise<void> {
    popupStore.hide('confirm', { isConfirmed: false })
}
</script>

<template>
    <Popup
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
    </Popup>
</template>
