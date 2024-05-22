<script setup lang="ts">
import { computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import AddLinkMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/DeleteGroupMenuItem.vue'
import RenameMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/RenameMenuItem.vue'

const { closePopup } = usePopupStore()
const { trans } = useTransStore()
const groupStore = useGroupStore()

const isEncrypted = computed<boolean>(() => {
    return !!groupStore.selectedGroup && groupStore.selectedGroup.isEncrypted
})
</script>

<template>
    <Popup
        :content="trans('Additional options')"
        @cancel="closePopup('groupView')"
    >
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
            <DeleteGroupMenuItem />
        </div>
    </Popup>
</template>
