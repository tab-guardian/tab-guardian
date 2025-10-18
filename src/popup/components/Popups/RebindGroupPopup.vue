<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useRouter } from 'vue-router'
import { validateURL } from '@common/modules/validation/url'
import { hashURL, getCurrentURL } from '@common/modules/url'
import { showToast } from '@common/modules/toast'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'
import ControlButton from '@/components/Views/SelectTabsView/ControlButton.vue'
import LinkIcon from '@common/components/Icons/LinkIcon.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()
const currURL = ref<string>('')

const errorMessage = computed<string | null>(() => validateURL(currURL.value))
const preventSubmit = computed<boolean>(() => validateURL(currURL.value) !== null)

async function setCurrentURL(): Promise<void> {
    const url = await getCurrentURL()

    if (url) {
        currURL.value = url
    }
}

async function rebindGroup(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        console.warn('No group selected rebinding URL')
        return
    }

    popupStore.hide('rebindGroup', {})

    await router.push({
        name: 'group',
        params: {
            id: groupStore.selectedGroup.id,
        },
    })

    groupStore.selectedGroup.bindURL = await hashURL(currURL.value)
    groupStore.saveGroup(groupStore.selectedGroup)

    showToast(trans('group_rebind_successful'))
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="popupStore.hide('rebindGroup', {})"
        :content="trans('enter_new_url_bind_to')"
        :description="trans('enter_new_url_bind_private_to_new_url')"
    >
        <form @submit.prevent="rebindGroup">
            <Input
                v-model="currURL"
                label="URL"
                @loaded="inp => inp.focus()"
                type="text"
                id="new-bind-url"
                placeholder="https://example.com"
                :error="errorMessage"
            />

            <div class="flex items-center justify-between gap-5 mt-3">
                <div>
                    <ControlButton @click="setCurrentURL">
                        {{ trans('use_current_url') }}
                    </ControlButton>
                </div>

                <Button
                    type="submit"
                    :disabled="preventSubmit"
                    :icon="CheckIcon"
                >
                    {{ trans('rebind') }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
