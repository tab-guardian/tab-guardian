<script setup lang="ts">
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import NewGroupNamePopup from '@/components/Popups/NewGroupNamePopup.vue'
import RebindGroupPopup from '@/components/Popups/RebindGroupPopup.vue'
import ChooseEmojiPopup from '@/components/Popups/ChooseEmojiPopup.vue'
import ChooseImageIconPopup from '@/components/Popups/ChooseImageIconPopup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import { usePopupStore } from '@/stores/popup'

const { isOpenPopup } = usePopupStore()
</script>

<template>
    <AppearTransition>
        <DeleteGroupPopup v-if="isOpenPopup('deleteGroup')" />
    </AppearTransition>

    <AppearTransition>
        <GroupMenuPopup v-if="isOpenPopup('groupView')" />
    </AppearTransition>

    <AppearTransition>
        <NewGroupNamePopup v-if="isOpenPopup('groupName')" />
    </AppearTransition>

    <AppearTransition>
        <RebindGroupPopup v-if="isOpenPopup('rebindGroup')" />
    </AppearTransition>

    <AppearTransition>
        <ChooseEmojiPopup v-if="isOpenPopup('chooseEmoji')" />
    </AppearTransition>

    <AppearTransition>
        <ChooseImageIconPopup v-if="isOpenPopup('chooseImageIcon')" />
    </AppearTransition>
</template>
