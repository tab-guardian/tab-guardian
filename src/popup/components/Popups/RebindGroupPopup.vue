<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useRouter } from 'vue-router'
import { validateURL } from '@/modules/url/validateURL'
import { hashURL } from '@/modules/url/hashURL'
import { error } from '@common/modules/error'
import { showToast } from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()
const url = ref<string>('')

const errorMessage = computed<string | null>(() => validateURL(url.value))
const preventSubmit = computed<boolean>(() => validateURL(url.value) !== null)

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

    showToast(trans('group_rebind_successful'))
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('rebindGroup')"
        :content="trans('enter_new_url_bind_to')"
        :description="trans('enter_new_url_bind_private_to_new_url')"
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
                {{ trans('rebind') }}
            </Button>
        </form>
    </Popup>
</template>
