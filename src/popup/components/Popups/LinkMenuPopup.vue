<script setup lang="ts">
import type { Group, Link } from '@/types'
import { computed } from 'vue'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/showToast'
import { useAppStore } from '@/stores/app'
import { error } from '@common/modules/error'
import Popup from '@/components/Popups/Popup.vue'
import MenuItem from '@/components/MenuItem.vue'
import ScissorsIcon from '@common/components/Icons/ScissorsIcon.vue'
import CopyIcon from '@common/components/Icons/CopyIcon.vue'
import PasteLinkMenuItem from '@/components//Views/GroupView/GroupControls/MenuItems/PasteLinkMenuItem.vue'

const { closePopup, getSharedData } = usePopupStore()
const appStore = useAppStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)
const link = computed<Link | null>(() => getSharedData<Link>())
const copyBtnTooltip = computed<string>(() => {
    if (appStore.bufferIsEmpty) {
        return ''
    }

    return trans('already_copied')
})

async function yankLink(action: 'copy' | 'cut'): Promise<void> {
    if (!appStore.bufferIsEmpty) {
        return
    }

    if (!link.value) {
        error.warn(`Cannot ${action} the link because link.value is null`)
        return
    }

    if (!group.value) {
        error.warn(`Cannot ${action} the link because group.value is null`)
        return
    }

    appStore.linkBuffer = {
        action,
        groupId: group.value.id,
        link: link.value,
    }
}

async function copyLink(): Promise<void> {
    yankLink('copy')
    showToast(trans('tab_copied'))
}

async function cutLink(): Promise<void> {
    yankLink('cut')
    showToast(trans('tab_cut'))
}
</script>

<template>
    <Popup
        v-if="group && link"
        :content="link.title"
        @cancel="closePopup('linkMenuView')"
    >
        <div class="flex flex-col gap-1 mt-3">
            <MenuItem
                :label="trans('cut_tab')"
                :icon="ScissorsIcon"
                @click="cutLink"
                :disabled="!appStore.bufferIsEmpty"
                :tip="copyBtnTooltip"
            />

            <MenuItem
                :label="trans('copy_tab')"
                :icon="CopyIcon"
                @click="copyLink"
                :disabled="!appStore.bufferIsEmpty"
                :tip="copyBtnTooltip"
            />

            <PasteLinkMenuItem :group />
        </div>
    </Popup>

    <!-- If there is no selected group (edge case) -->
    <Popup
        v-else
        :content="trans('error_no_group_selected')"
        @cancel="closePopup('linkMenuView')"
    />
</template>
