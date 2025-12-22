<script setup lang="ts">
import { ref, computed } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { validateUrl } from '@common/modules/validation/url'
import { hashUrl, getCurrentUrl } from '@common/modules/url'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'

const popupStore = usePopupStore()
const currUrl = ref<string>('')

const errorMessage = computed<string | null>(() => validateUrl(currUrl.value))
const preventSubmit = computed<boolean>(() => validateUrl(currUrl.value) !== null)

async function setCurrentUrl(): Promise<void> {
    const url = await getCurrentUrl()

    if (url) {
        currUrl.value = url
    }
}

async function bindGroup(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    popupStore.hide('bindGroup', {
        url: await hashUrl(currUrl.value),
    })
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('bindGroup', {})"
        :title="trans('enter_new_url_bind_to')"
        :description="trans('enter_new_url_bind_private_to_new_url')"
    >
        <form @submit.prevent="bindGroup">
            <Input
                v-model="currUrl"
                label="URL"
                @loaded="inp => inp.focus()"
                type="text"
                id="new-bind-url"
                placeholder="https://example.com"
                :error="errorMessage"
            />

            <div class="flex items-center justify-between gap-5 mt-3">
                <div>
                    <ControlButton @click="setCurrentUrl">
                        {{ trans('use_current_url') }}
                    </ControlButton>
                </div>

                <Button type="submit" :disabled="preventSubmit" :icon="CheckIcon">
                    {{ trans('rebind') }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
