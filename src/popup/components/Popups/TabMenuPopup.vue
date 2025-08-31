<script setup lang="ts">
import type { Group, Link } from '@/types'
import { computed } from 'vue'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import MenuItem from '@/components/MenuItem.vue'
import ScissorsIcon from '@common/components/Icons/ScissorsIcon.vue'
import CopyIcon from '@common/components/Icons/CopyIcon.vue'
import { showToast } from '@common/modules/showToast'

const { closePopup, getSharedData } = usePopupStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)
const link = computed<Link | null>(() => getSharedData<Link>())

async function copyTab(): Promise<void> {
    showToast(trans('tab_copied'))
}

async function cutTab(): Promise<void> {
    showToast(trans('tab_cut'))
}
</script>

<template>
    <Popup
        v-if="link"
        :content="link.title"
        @cancel="closePopup('tabMenuView')"
    >
        <div class="flex flex-col gap-1 mt-3">
            <MenuItem
                :label="trans('cut_tab')"
                :icon="ScissorsIcon"
                @click="cutTab"
                :disabled="true"
            />

            <MenuItem
                :label="trans('copy_tab')"
                :icon="CopyIcon"
                @click="copyTab"
            />
        </div>
    </Popup>
</template>
