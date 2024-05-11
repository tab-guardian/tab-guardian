<script setup lang="ts">
import EllipsisVerticalIcon from '@/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import Popup from '@/components/Popup.vue'
import AddLinkMenuItem from '@/components/Modals/GroupModal/GroupControls/MenuItems/AddLinkMenuItem.vue'
import DeleteGroupMenuItem from '@/components/Modals/GroupModal/GroupControls/MenuItems/DeleteGroupMenuItem.vue'
import RenameMenuItem from '@/components/Modals/GroupModal/GroupControls/MenuItems/RenameMenuItem.vue'
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'

const store = useGroupStore()
const { trans } = useTransStore()
</script>

<template>
    <Control @click="store.isMenuOpen = true">
        <EllipsisVerticalIcon style="width: 100%" />
    </Control>

    <Popup
        v-if="store.isMenuOpen"
        :content="trans('Additional options')"
        @cancel="store.isMenuOpen = false"
    >
        <div class="menu-items">
            <AddLinkMenuItem />
            <RenameMenuItem />
            <DeleteGroupMenuItem />
        </div>
    </Popup>
</template>

<style lang="sass" scoped>
.menu-items
    margin-top: 12px
    display: flex
    flex-direction: column
    gap: 7px
</style>
