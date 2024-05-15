<script setup lang="ts">
import type { Group } from '@/types'
import { computed, watchEffect } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { useRoute } from 'vue-router'
import View from '@/components/Views/View.vue'
import Links from '@/components/Views/GroupView/Links.vue'
import GroupName from '@/components/Views/GroupView/GroupName.vue'
import MenuButton from '@/components/Views/GroupView/GroupControls/MenuButton.vue'
import EnterPassword from '@/components/Views/GroupView/EnterPassword.vue'
import Actions from '@/components/Views/GroupView/GroupControls/Actions/Actions.vue'
import IsUnlockedBox from '@/components/Views/GroupView/IsUnlockedBox.vue'

const { trans } = useTransStore()
const { params } = useRoute()
const store = useGroupStore()

const group = computed<Group | null>(() => {
    const id = params.id

    if (!id) {
        return null
    }

    return store.getGroupById(Number(id))
})

const showButtons = computed<boolean>(() => {
    return group.value !== null && !group.value.isEncrypted
})

watchEffect(() => {
    store.selectedGroup = group.value
})
</script>

<template>
    <View>
        <template #controls>
            <Actions v-if="group && showButtons" :group />
            <MenuButton />
        </template>

        <div v-if="group" class="group">
            <GroupName :group />

            <IsUnlockedBox
                v-if="group.isPrivate && !group.isEncrypted"
                :group
            />

            <EnterPassword v-if="group.isEncrypted" :group />
            <Links v-else :group />
        </div>

        <div v-else class="message">
            <h2>😢 {{ trans('Something went wrong! No group selected') }}</h2>
        </div>
    </View>
</template>
