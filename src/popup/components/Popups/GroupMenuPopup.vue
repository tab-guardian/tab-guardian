<script setup lang="ts">
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import Popup from '@/components/Popups/Popup.vue'
import AddLinkMenuItem from '@/components/Modals/GroupModal/GroupControls/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Modals/GroupModal/GroupControls/MenuItems/DeleteGroupMenuItem.vue'
import RenameMenuItem from '@/components/Modals/GroupModal/GroupControls/MenuItems/RenameMenuItem.vue'
import AppearTransition from '@/components/Transitions/AppearTransition.vue'

const { isOpenPopup, closePopup } = usePopupStore()
const { trans } = useTransStore()
</script>

<template>
    <AppearTransition>
        <Popup
            v-if="isOpenPopup('groupModalMenu')"
            :content="trans('Additional options')"
            @cancel="closePopup('groupModalMenu')"
        >
            <div class="menu-items">
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
</style>
