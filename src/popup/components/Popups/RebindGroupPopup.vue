<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useRouter } from 'vue-router'
import useUrlHelper from '@common/composables/useUrlHelper'
import hashURL from '@/modules/hashURL'
import error from '@common/modules/error'
import showToast from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { trans } = useTransStore()
const { closePopup } = usePopupStore()
const { urlError } = useUrlHelper()
const groupStore = useGroupStore()
const router = useRouter()
const url = ref<string>('')

const errorMessage = computed<string | null>(() => urlError(url.value))
const preventSubmit = computed<boolean>(() => urlError(url.value) !== null)

async function rebindGroup(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        error.warn('No group selected rebinding URL')
        return
    }

    closePopup('rebindGroup')

    await router.push({
        name: 'group',
        params: {
            id: groupStore.selectedGroup.id,
        },
    })

    groupStore.selectedGroup.bindURL = hashURL(url.value)
    groupStore.saveGroup(groupStore.selectedGroup)

    showToast(trans('Group rebind successful'))
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('rebindGroup')"
        :content="trans('Enter a new URL to bind to')"
        :description="
            trans(
                'Enter a new URL to bind your private group to this new URL. This group will be only visible in the list of groups only when you visit this specific URL. Do not forget to lock the group',
            )
        "
    >
        <form @submit.prevent="rebindGroup">
            <Input
                v-model="url"
                label="URL"
                @loaded="inp => inp.focus()"
                type="text"
                id="new-bind-url"
                placeholder="https://example.com"
                :error="errorMessage"
            />

            <Button type="submit" :disabled="preventSubmit" class="mt-3">
                <CheckIcon width="20" height="20" />
                {{ trans('Rebind') }}
            </Button>
        </form>
    </Popup>
</template>
