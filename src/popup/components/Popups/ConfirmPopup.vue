<script setup lang="ts">
import { trans } from '@common/modules'
import { computed } from 'vue'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/toast'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'

const popupStore = usePopupStore()

const sharedData = computed(() => {
    const data = popupStore.getSharedData('confirm')

    if (!data) {
        showToast({ text: trans('error_occurred'), type: 'error' })
        throw new Error('sharedData must not be nullable in ConfirmPopup.vue')
    }

    return data
})

async function handleConfirm(): Promise<void> {
    popupStore.hide('confirm', { isConfirmed: true })
}

async function handleDeny(): Promise<void> {
    popupStore.hide('confirm', { isConfirmed: false })
}
</script>

<template>
    <Popup @cancel="handleDeny" :content="sharedData.text">
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
