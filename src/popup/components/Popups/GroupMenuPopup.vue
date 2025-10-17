<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules/utils'
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
import PasteLinkMenuItem from '@/components//Views/GroupView/GroupControls/MenuItems/PasteLinkMenuItem.vue'
import MakeGroupPublicItem from '@/components//Views/GroupView/GroupControls/MenuItems/MakeGroupPublicItem.vue'
import Message from '@common/components/Message.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()
const group = computed<Group | null>(() => groupStore.selectedGroup)

const isEncrypted = computed<boolean>(() => {
    return group.value !== null && group.value.isEncrypted
})
</script>

<template>
    <Popup
        :content="trans('additional_options')"
        @cancel="popupStore.hide('groupMenuView', {})"
    >
        <div v-if="group">
            <p
                v-if="isEncrypted"
                class="mt-2 pt-2 text-font-gray border-t border-border"
            >
                {{ trans('group_private_unlock_it') }}
            </p>

            <div v-else class="space flex flex-col gap-1 mt-3">
                <RouterLink :to="{ name: 'groupDetails', params: { id: group.id } }">
                    <MenuItem :label="trans('details')" :icon="InfoCircleIcon" />
                </RouterLink>

                <PasteLinkMenuItem :group />
                <MakeGroupPublicItem v-if="group.isPrivate" :group />
                <AddLinkMenuItem />
                <RenameGroupMenuItem />
                <ExportGroupMenuItem :group />

                <RouterLink
                    v-if="!group.isPrivate"
                    :to="{ name: 'groupIcon', params: { id: group.id } }"
                >
                    <MenuItem :label="trans('change_icon')" :icon="PhotoIcon" />
                </RouterLink>

                <RebindUrlItem v-if="group.isPrivate && group.bindURL" />
                <DeleteGroupMenuItem :group />
            </div>
        </div>

        <!-- If there is no selected group (edge case) -->
        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </Popup>
</template>
