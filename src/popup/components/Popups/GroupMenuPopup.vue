<script setup lang="ts">
import { computed } from 'vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import Popup from '@/components/Popups/Popup.vue'
import AddLinkMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/DeleteGroupMenuItem.vue'
import RenameMenuItem from '@/components/Views/GroupView/GroupControls/MenuItems/RenameMenuItem.vue'
import AppearTransition from '@/components/Transitions/AppearTransition.vue'
import EnterPassword from '@/components/Views/GroupView/EnterPassword.vue'

const { isOpenPopup, closePopup } = usePopupStore()
const { trans } = useTransStore()
const groupStore = useGroupStore()

const isEncrypted = computed<boolean>(() => {
    return !!groupStore.selectedGroup && groupStore.selectedGroup.isEncrypted
})
</script>

<template>
    <AppearTransition>
        <Popup
            v-if="isOpenPopup('groupView')"
            :content="trans('Additional options')"
            @cancel="closePopup('groupView')"
        >
            <span v-if="isEncrypted" class="warning">
                <!-- prettier-ignore -->
                {{ trans('This group is private. You need to unlock it to see the links') }}
            </span>

            <div v-else class="menu-items">
                <AddLinkMenuItem />
                <RenameMenuItem />
                <DeleteGroupMenuItem />
            </div>
        </Popup>
    </AppearTransition>
</template>

<style lang="sass" scoped>
.menu-items
    margin-top: 12px
    display: flex
    flex-direction: column
    gap: 7px

.warning
    display: block
    margin-top: 16px
</style>
