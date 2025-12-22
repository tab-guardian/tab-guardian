<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { logger, trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import { useLinkStore } from '@/stores/link'
import { limitString } from '@common/modules'
import Popup from '@/components/Popups/Popup.vue'
import MenuItem from '@/components/MenuItem.vue'
import ScissorsIcon from '@common/components/Icons/ScissorsIcon.vue'
import CopyIcon from '@common/components/Icons/CopyIcon.vue'
import PinIcon from '@common/components/Icons/PinIcon.vue'
import PasteLinkMenuItem from '@/components/Popups/Link/MenuItems/PasteLinkMenuItem.vue'

const popupStore = usePopupStore()
const linkStore = useLinkStore()
const groupStore = useGroupStore()

const group = computed<Group | null>(() => groupStore.selectedGroup)

const sharedData = computed(() => {
    const data = popupStore.getSharedData('linkMenu')

    if (!data) {
        showToast({ text: trans('error_occurred'), type: 'error' })
        throw new Error('sharedData must not be nullable in LinkMenuPopup.vue')
    }

    return data
})

async function yankLink(action: 'copy' | 'cut', successMsg: string): Promise<void> {
    if (!group.value) {
        logger().warn(`Cannot ${action} the link because group.value is null`)
        return
    }

    await linkStore.copy({
        action,
        initialGroupId: group.value.id,
        link: sharedData.value.link,
    })

    popupStore.hideAll()
    showToast({ text: successMsg })
}

async function copyLink(): Promise<void> {
    yankLink('copy', trans('tab_copied'))
}

async function cutLink(): Promise<void> {
    yankLink('cut', trans('tab_cut'))
}

async function togglePin(): Promise<void> {
    if (!group.value) {
        logger().warn(`Cannot pin the link because group.value is null`)
        return
    }

    await groupStore.updateLink(group.value.id, sharedData.value.link.id, {
        isPinned: !sharedData.value.link.isPinned,
    })

    popupStore.hideAll()
}
</script>

<template>
    <Popup
        v-if="group && sharedData"
        :title="limitString(sharedData.link.title, 25)"
        @cancel="popupStore.hide('linkMenu', {})"
    >
        <div class="flex flex-col gap-1 mt-3">
            <MenuItem :label="trans('cut')" :icon="ScissorsIcon" @click="cutLink" />

            <MenuItem :label="trans('copy')" :icon="CopyIcon" @click="copyLink" />

            <MenuItem
                :label="trans(sharedData.link.isPinned ? 'unpin' : 'pin')"
                :icon="PinIcon"
                @click="togglePin"
            />

            <PasteLinkMenuItem :group />
        </div>
    </Popup>

    <!-- If there is no selected group (edge case) -->
    <Popup
        v-else
        :title="trans('error_no_tab_selected')"
        @cancel="popupStore.hide('linkMenu', {})"
    />
</template>
