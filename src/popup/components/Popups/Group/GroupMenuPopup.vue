<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import AddLinkMenuItem from '@/components/Popups/Group/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Popups/Group/MenuItems/DeleteGroupMenuItem.vue'
import RenameGroupMenuItem from '@/components/Popups/Group/MenuItems/RenameGroupMenuItem.vue'
import MakeGroupPrivateItem from '@/components/Popups/Group/MenuItems/MakeGroupPrivateItem.vue'
import BindToUrlItem from '@/components/Popups/Group/MenuItems/BindToUrlItem.vue'
import ExportGroupMenuItem from '@/components/Popups/Group/MenuItems/ExportGroupMenuItem.vue'
import PasteLinkMenuItem from '@/components/Popups/Link/MenuItems/PasteLinkMenuItem.vue'
import MakeGroupOpenItem from '@/components/Popups/Group/MenuItems/MakeGroupOpenItem.vue'
import PhotoIcon from '@common/components/Icons/PhotoIcon.vue'
import InfoCircleIcon from '@common/components/Icons/InfoCircleIcon.vue'
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
        @cancel="popupStore.hide('groupMenu', {})"
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
                <AddLinkMenuItem />
                <RenameGroupMenuItem />
                <ExportGroupMenuItem :group />

                <template v-if="group.isPrivate">
                    <BindToUrlItem :group />
                    <MakeGroupOpenItem :group />
                </template>

                <template v-else>
                    <RouterLink
                        :to="{ name: 'groupIcon', params: { id: group.id } }"
                    >
                        <MenuItem :label="trans('change_icon')" :icon="PhotoIcon" />
                    </RouterLink>

                    <MakeGroupPrivateItem :group />
                </template>

                <DeleteGroupMenuItem :group />
            </div>
        </div>

        <!-- If there is no selected group (edge case) -->
        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </Popup>
</template>
