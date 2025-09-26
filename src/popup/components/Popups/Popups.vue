<script setup lang="ts">
import type { Component } from 'vue'
import type { Popups } from '@/types'
import { usePopupStore } from '@/stores/popup'
import NewGroupNamePopup from '@/components/Popups/NewGroupNamePopup.vue'
import AppearTransition from '@common/components/Transitions/AppearTransition.vue'
import DeleteGroupPopup from '@/components/Popups/DeleteGroupPopup.vue'
import NewPasswordPopup from '@/components/Popups/NewPasswordPopup.vue'
import RebindGroupPopup from '@/components/Popups/RebindGroupPopup.vue'
import ChooseEmojiPopup from '@/components/Popups/ChooseEmojiPopup.vue'
import ChooseImageIconPopup from '@/components/Popups/ChooseImageIconPopup.vue'
import LinkMenuPopup from '@/components/Popups/LinkMenuPopup.vue'
import GroupMenuPopup from '@/components/Popups/GroupMenuPopup.vue'
import EditGroupNamePopup from '@/components/Popups/EditGroupNamePopup.vue'

const { isOpenPopup } = usePopupStore()

const popups: Array<{ name: keyof Popups, comp: Component }> = [
    {comp: DeleteGroupPopup, name: 'deleteGroup'},
    {comp: NewGroupNamePopup, name: 'newGroupName'},
    {comp: NewPasswordPopup, name: 'newPassword'},
    {comp: RebindGroupPopup, name: 'rebindGroup'},
    {comp: ChooseEmojiPopup, name: 'chooseEmoji'},
    {comp: ChooseImageIconPopup, name: 'chooseImageIcon'},
    {comp: LinkMenuPopup, name: 'linkMenuView'},
    {comp: GroupMenuPopup, name: 'groupMenuView'},
    {comp: EditGroupNamePopup, name: 'editGroupName'},
]
</script>

<template>
    <AppearTransition v-for="popup in popups" :key="popup.name">
        <Component :is="popup.comp" v-if="isOpenPopup(popup.name)" />
    </AppearTransition>
</template>
