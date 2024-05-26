<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useSelectTabsStore } from '@/stores/selectTabs'
import showToast from '@common/modules/showToast'
import getCurrentURL from '@/modules/getCurrentURL'
import error from '@common/modules/error'
import hashURL from '@/modules/hashURL'
import Popup from '@/components/Popups/Popup.vue'
import Input from '@common/components/Form/Input.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const { trans } = useTransStore()
const { closePopup, closeAllPopups } = usePopupStore()
const store = useGroupStore()
const selectTabsStore = useSelectTabsStore()

const currURL = ref<string | null>(null)
const bindTip = ref<string>(
    'Bind this group to the (:n) URL. This will hide the group from everywhere else except this URL. It adds an extra layer of security',
)

onMounted(async () => {
    store.newGroup.name = ''
    store.newGroup.password = ''

    await setBindTip()
})

async function setBindTip(): Promise<void> {
    const url = await getCurrentURL()

    if (url) {
        currURL.value = url
        return
    }

    currURL.value = null
    bindTip.value = `This feature doesn't work for this current URL`
}

function attachBindURL(checked: boolean): void {
    if (!checked) {
        store.newGroup.bindURL = null
        return
    }

    if (!currURL.value) {
        error.err('No current URL found')
        showToast(trans('Error ocurred'), 'error')
        return
    }

    store.newGroup.bindURL = hashURL(currURL.value)
}

function selectLinks(): void {
    if (store.newGroup.isPrivate && !store.newGroup.password) {
        showToast(trans('Password is empty'), 'error')
        return
    }

    if (store.groupNameLength > store.groupNameMaxLength) {
        showToast(trans('Group name is too long'), 'error')
        return
    }

    closeAllPopups()

    selectTabsStore.showView({
        selectAll: true,
        operation: 'creating',
    })
}
</script>

<template>
    <Popup @cancel="closePopup('groupName')" :content="trans('Enter a group name')">
        <form @submit.prevent="selectLinks" class="flex flex-col gap-3">
            <Input
                v-model="store.newGroup.name"
                :label="trans('Group name')"
                @loaded="inp => inp.focus()"
                :meta="`${store.groupNameLength} / ${store.groupNameMaxLength}`"
                :maxlength="store.groupNameMaxLength"
                type="text"
                id="new-group-name"
            />

            <Input
                v-if="store.newGroup.isPrivate"
                v-model="store.newGroup.password"
                type="password"
                id="group-password"
                :label="trans('Group password')"
            />

            <div class="flex items-end gap-3 justify-between">
                <SlideSwitch
                    v-if="store.newGroup.isPrivate"
                    v-tippy="currURL ? trans(bindTip, currURL) : trans(bindTip)"
                    :disabled="!currURL"
                    @changed="attachBindURL"
                >
                    <div class="flex items-center gap-1">
                        {{ trans('Bind to this URL') }}
                    </div>
                </SlideSwitch>

                <div v-else></div>

                <Button type="submit">
                    {{ trans('Select Tabs') }}
                    <ChevronRightIcon width="20" height="20" />
                </Button>
            </div>
        </form>
    </Popup>
</template>
