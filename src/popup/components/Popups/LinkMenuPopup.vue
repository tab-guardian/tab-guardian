<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import { useAppStore } from '@/stores/app'
import { limitString } from '@common/modules/utils'
import Popup from '@/components/Popups/Popup.vue'
import MenuItem from '@/components/MenuItem.vue'
import ScissorsIcon from '@common/components/Icons/ScissorsIcon.vue'
import CopyIcon from '@common/components/Icons/CopyIcon.vue'
import PasteLinkMenuItem from '@/components//Views/GroupView/GroupControls/MenuItems/PasteLinkMenuItem.vue'

const popupStore = usePopupStore()
const appStore = useAppStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)
const sharedData = popupStore.getSharedData('linkMenuView')

async function yankLink(action: 'copy' | 'cut', successMsg: string): Promise<void> {
    if (!sharedData) {
        showToast(trans('error_occurred'), 'error')
        throw new Error('sharedData is null in LinkMenuPopup.vue')
    }

    if (!group.value) {
        console.warn(`Cannot ${action} the link because group.value is null`)
        return
    }

    appStore.linkBuffer = {
        action,
        groupId: group.value.id,
        link: sharedData.link,
    }

    popupStore.hideAll()
    showToast(successMsg)
}

async function copyLink(): Promise<void> {
    yankLink('copy', trans('tab_copied'))
}

async function cutLink(): Promise<void> {
    yankLink('cut', trans('tab_cut'))
}
</script>

<template>
    <Popup
        v-if="group && sharedData"
        :content="limitString(sharedData.link.title, 25)"
        @cancel="popupStore.hide('linkMenuView', {})"
    >
        <div class="flex flex-col gap-1 mt-3">
            <MenuItem
                :label="trans('cut_tab')"
                :icon="ScissorsIcon"
                @click="cutLink"
            />

            <MenuItem
                :label="trans('copy_tab')"
                :icon="CopyIcon"
                @click="copyLink"
            />

            <PasteLinkMenuItem :group />
        </div>
    </Popup>

    <!-- If there is no selected group (edge case) -->
    <Popup
        v-else
        :content="trans('error_no_tab_selected')"
        @cancel="popupStore.hide('linkMenuView', {})"
    />
</template>
