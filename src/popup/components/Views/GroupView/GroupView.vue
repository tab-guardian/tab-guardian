<script setup lang="ts">
import type { Group } from '@common/types'
import { computed, watchEffect } from 'vue'
import { trans } from '@common/modules/utils'
import { useGroupStore } from '@/stores/group'
import { useRoute } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import View from '@/components/Views/View.vue'
import Links from '@/components/Views/GroupView/Links.vue'
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import Actions from '@/components/Views/GroupView/GroupControls/Actions/Actions.vue'
import Control from '@/components/Control.vue'
import IsLockedBox from '@/components/Views/GroupView/IsLockedBox.vue'
import IsUnlockedBox from '@/components/Views/GroupView/IsUnlockedBox.vue'
import Message from '@common/components/Message.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'

const route = useRoute()
const groupStore = useGroupStore()
const { openPopup } = usePopupStore()

const group = computed<Group | null>(() => {
    const id = route.params.id

    if (!id) {
        return null
    }

    return groupStore.getGroupById(Number(id))
})

const showButtons = computed<boolean>(() => {
    return group.value !== null && !group.value.isEncrypted
})

watchEffect(() => {
    groupStore.selectedGroup = group.value
})
</script>

<template>
    <View :routeLocation="{ name: 'main' }">
        <template #controls>
            <Actions v-if="group && showButtons" :group />

            <Control @click="openPopup('groupMenuView', {})">
                <EllipsisVerticalIcon style="width: 100%" />
            </Control>
        </template>

        <div v-if="group">
            <div class="flex items-center gap-1 relative">
                <GroupIcon v-if="group.icon" :group />
                <h2 class="text-lg my-1 px-2 py-0.5">{{ group.name }}</h2>
            </div>

            <template v-if="group.isPrivate">
                <IsLockedBox v-if="group.isEncrypted" :group />
                <IsUnlockedBox v-else :group />
            </template>

            <Links v-if="!group.isEncrypted" :group />
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
