<script setup lang="ts">
import { logger } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { ref } from 'vue'
import Popup from '@/components/Popups/Popup.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import FolderPlusIcon from '@common/components/Icons/FolderPlusIcon.vue'
import Button from '@common/components/Form/Button.vue'

const popupStore = usePopupStore()

const sharedData = popupStore.getSharedData('textInput')!

const error = ref<boolean>(false)
const inputText = ref<string>(sharedData.text || '')

async function submitName(): Promise<void> {
    if (error.value) {
        logger().warn('Cannot submit because of some errors')
        return
    }

    popupStore.hide('textInput', {
        name: inputText.value,
        canceled: false,
    })
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('textInput', { canceled: true })"
        :content="sharedData.title"
    >
        <form @submit.prevent="submitName" class="flex flex-col gap-3">
            <NameInput
                v-model:name="inputText"
                :label="sharedData.label"
                @loaded="inp => inp.focus()"
                @has-error="error = $event"
            />

            <div class="flex justify-end">
                <Button type="submit" :disabled="error" :icon="FolderPlusIcon">
                    {{ sharedData.submitText }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
