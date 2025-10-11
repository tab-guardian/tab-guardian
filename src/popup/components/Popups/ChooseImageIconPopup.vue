<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import { isImageURL } from '@/modules/url/isImageURL'
import { validateImageURL } from '@/modules/url/validateImageURL'
import Popup from '@/components/Popups/Popup.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const url = ref<string>('')
const errorMessage = computed<string | null>(() => validateImageURL(url.value))
const preventSubmit = computed<boolean>(() => validateImageURL(url.value) !== null)

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
        console.warn('No group selected rebinding URL')
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
        <template #right-side>
            <img v-if="url" :src="url" width="30" />
        </template>

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
                :is-secondary="true"
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
