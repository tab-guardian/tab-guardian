<script setup lang="ts">
import type { Group } from '@/types'
import { computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import AddLinkMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/DeleteGroupMenuItem.vue'
import RenameMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/RenameMenuItem.vue'
import MenuItem from '@/components/MenuItem.vue'
import PhotoIcon from '@common/components/Icons/PhotoIcon.vue'

const { closePopup } = usePopupStore()
const { trans } = useTransStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)

const isEncrypted = computed<boolean>(() => {
    return group.value !== null && group.value.isEncrypted
})
</script>

<template>
    <Popup :content="trans('Additional options')" @cancel="closePopup('groupView')">
        <p
            v-if="isEncrypted"
            class="mt-2 pt-2 text-font-gray border-t border-border"
        >
            <!-- prettier-ignore -->
            {{ trans('This group is private. You need to unlock it to see the links') }}
        </p>

        <div v-else class="flex flex-col gap-1 mt-3">
            <AddLinkMenuItem />
            <RenameMenuItem />

            <RouterLink
                v-if="group && !group.isPrivate"
                :to="{ name: 'groupIcon', params: { id: group.id } }"
            >
                <MenuItem :label="trans('Change Icon')" :icon="PhotoIcon" />
            </RouterLink>

            <DeleteGroupMenuItem />
        </div>
    </Popup>
</template>
