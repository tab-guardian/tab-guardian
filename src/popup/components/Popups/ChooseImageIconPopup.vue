<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { error } from '@common/modules/error'
import { useURLHelper } from '@common/composables/useURLHelper'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { submitPopup, closePopup } = usePopupStore()
const { urlError } = useURLHelper()
const groupStore = useGroupStore()
const url = ref<string>('')

const errorMessage = computed<string | null>(() => urlError(url.value))
const preventSubmit = computed<boolean>(() => urlError(url.value) !== null)

async function chooseImageIcon(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        error.warn('No group selected rebinding URL')
        return
    }

    submitPopup('chooseImageIcon', url.value)
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('chooseImageIcon')"
        :content="trans('enter_image_url')"
        :description="trans('type_any_image_url_to_set_it')"
    >
        <form @submit.prevent="chooseImageIcon">
            <Input
                v-model="url"
                label="URL"
                @loaded="inp => inp.focus()"
                type="text"
                id="group-icon-emoji"
                placeholder="https://example.com/icon.png"
                :error="errorMessage"
            />

            <Button type="submit" :disabled="preventSubmit" class="mt-3">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </form>
    </Popup>
</template>
