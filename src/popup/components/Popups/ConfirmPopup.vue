<script setup lang="ts">
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'

const popupStore = usePopupStore()

const sharedData = popupStore.getSharedData('confirm')

async function handleConfirm(): Promise<void> {
    popupStore.hide('confirm', { isConfirmed: true })
}

async function handleDeny(): Promise<void> {
    popupStore.hide('confirm', { isConfirmed: false })
}
</script>

<template>
    <Popup @cancel="handleDeny" :content="sharedData?.title || ''">
        <template #buttons>
            <Button @click="handleDeny" is="outline">
                {{ trans('no') }}
            </Button>

            <Button @click="handleConfirm" is="success">
                {{ trans('yes') }}
            </Button>
        </template>
    </Popup>
</template>
