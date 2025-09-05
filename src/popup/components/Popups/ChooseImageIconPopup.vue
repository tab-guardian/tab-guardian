<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { error } from '@common/modules/error'
import { validateURL } from '@common/modules/validateURL'
import { isImageURL } from '@/modules/isImageURL'
import Popup from '@/components/Popups/Popup.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const url = ref<string>('')

const errorMessage = computed<string | null>(() => validateURL(url.value))
const preventSubmit = computed<boolean>(() => validateURL(url.value) !== null)

onMounted(setImageIcon)

function setImageIcon(): void {
    const group = groupStore.selectedGroup

    if (!group || !isImageURL(group.icon)) {
        return
    }

    url.value = group.icon!
}

async function chooseImageIcon(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        error.warn('No group selected rebinding URL')
        return
    }

    closePopup('chooseImageIcon', url.value)
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('chooseImageIcon')"
        :content="trans('enter_image_url')"
        :description="trans('type_any_image_url_to_set_it')"
    >
        <Input
            v-model="url"
            label="URL"
            @loaded="inp => inp.focus()"
            type="text"
            id="group-icon-emoji"
            placeholder="https://example.com/icon.png"
            :error="errorMessage"
        />

        <template #buttons>
            <PopupButton
                @click="closePopup('chooseImageIcon')"
                :isSecondary="true"
            >
                {{ trans('cancel') }}
            </PopupButton>

            <PopupButton @click="chooseImageIcon" :disabled="preventSubmit">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </PopupButton>
        </template>
    </Popup>
</template>
