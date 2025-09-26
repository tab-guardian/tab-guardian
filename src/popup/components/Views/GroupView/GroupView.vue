<script setup lang="ts">
import type { Group } from '@/types'
import { computed, watchEffect } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { useRoute } from 'vue-router'
import View from '@/components/Views/View.vue'
import Links from '@/components/Views/GroupView/Links.vue'
import MenuButton from '@/components/Views/GroupView/GroupControls/MenuButton.vue'
import EnterPassword from '@/components/Views/GroupView/EnterPassword.vue'
import Actions from '@/components/Views/GroupView/GroupControls/Actions/Actions.vue'
import IsUnlockedBox from '@/components/Views/GroupView/IsUnlockedBox.vue'
import Message from '@common/components/Message.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'

const route = useRoute()
const groupStore = useGroupStore()

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
            <MenuButton />
        </template>

        <div v-if="group">
            <div class="flex items-center gap-1 relative">
                <GroupIcon v-if="group.icon" :group />
                <h2 class="text-lg my-1 px-2 py-0.5">{{ group.name }}</h2>
            </div>

            <IsUnlockedBox v-if="group.isPrivate && !group.isEncrypted" :group />

            <EnterPassword v-if="group.isEncrypted" :group />
            <Links v-else :group />
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
