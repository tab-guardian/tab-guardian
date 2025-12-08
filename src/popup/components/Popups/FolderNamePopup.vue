<script setup lang="ts">
import { logger, trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import { ref } from 'vue'
import { folderStorage } from '@common/modules/storage/folder'
import Popup from '@/components/Popups/Popup.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import FolderPlusIcon from '@common/components/Icons/FolderPlusIcon.vue'
import Button from '@common/components/Form/Button.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()

const error = ref<boolean>(false)
const name = ref<string>('')

async function submitName(): Promise<void> {
    if (error.value) {
        logger().warn('Cannot submit because folder name has some errors')
        return
    }

    folderStorage.save(name.value)

    await groupStore.load()

    popupStore.hide('folderName', {})

    showToast({ text: trans('folder_created') })
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('folderName', {})"
        :content="trans('enter_folder_name')"
    >
        <form @submit.prevent="submitName" class="flex flex-col gap-3">
            <NameInput
                v-model:name="name"
                :label="trans('folder_name')"
                @loaded="inp => inp.focus()"
                @has-error="error = $event"
            />

            <div class="flex justify-end">
                <Button
                    type="submit"
                    :disabled="error"
                    :icon="FolderPlusIcon"
                >
                    {{ trans('create') }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
