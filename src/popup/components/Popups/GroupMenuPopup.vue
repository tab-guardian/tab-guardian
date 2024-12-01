<script setup lang="ts">
import type { Group } from '@/types'
import { computed } from 'vue'
import trans from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import AddLinkMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/DeleteGroupMenuItem.vue'
import RenameGroupMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/RenameGroupMenuItem.vue'
import RebindUrlItem from '@/components/Views/GroupView/GroupControls/MenuItems/RebindUrlItem.vue'
import ExportGroupMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/ExportGroupMenuItem.vue'
import MenuItem from '@/components/MenuItem.vue'
import PhotoIcon from '@common/components/Icons/PhotoIcon.vue'
import InfoCircleIcon from '@common/components/Icons/InfoCircleIcon.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)

const isEncrypted = computed<boolean>(() => {
    return group.value !== null && group.value.isEncrypted
})
</script>

<template>
    <Popup :content="trans('additional_options')" @cancel="closePopup('groupView')">
        <p
            v-if="isEncrypted"
            class="mt-2 pt-2 text-font-gray border-t border-border"
        >
            {{ trans('group_private_unlock_it') }}
        </p>

        <div v-else class="flex flex-col gap-1 mt-3">
            <RouterLink
                v-if="group"
                :to="{ name: 'groupInfo', params: { id: group.id } }"
            >
                <MenuItem :label="trans('details')" :icon="InfoCircleIcon" />
            </RouterLink>

            <AddLinkMenuItem />
            <RenameGroupMenuItem />
            <ExportGroupMenuItem />

            <RouterLink
                v-if="group && !group.isPrivate"
                :to="{ name: 'groupIcon', params: { id: group.id } }"
            >
                <MenuItem :label="trans('change_icon')" :icon="PhotoIcon" />
            </RouterLink>

            <RebindUrlItem v-if="group && group.isPrivate && group.bindURL" />
            <DeleteGroupMenuItem />
        </div>
    </Popup>
</template>
