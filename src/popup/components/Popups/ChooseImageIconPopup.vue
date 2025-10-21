<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { isImageUrl } from '@common/modules/url'
import { validateImageUrl } from '@common/modules/validation/url'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()

const url = ref<string>('')

const errorMessage = computed<string | null>(() => validateImageUrl(url.value))
const preventSubmit = computed<boolean>(() => validateImageUrl(url.value) !== null)

onMounted(setImageIcon)

function setImageIcon(): void {
    const group = groupStore.selectedGroup

    if (!group || !isImageUrl(group.icon)) {
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

    hideImageIconPopup()
}

function hideImageIconPopup(): void {
    popupStore.hide('chooseImageIcon', { url: null })
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="hideImageIconPopup"
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
            <Button @click="hideImageIconPopup" is="outline">
                {{ trans('cancel') }}
            </Button>

            <Button is="success" @click="chooseImageIcon" :disabled="preventSubmit">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </template>
    </Popup>
</template>
