<script setup lang="ts">
import type { Group } from '@common/types'
import { computed, onMounted } from 'vue'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { useRoute, RouteLocationRaw } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import View from '@/components/Views/View.vue'
import Links from '@/components/Views/GroupView/Links.vue'
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import Actions from '@/components/Views/GroupView/GroupControls/Actions/Actions.vue'
import Control from '@/components/Control.vue'
import IsLockedBox from '@/components/Views/GroupView/IsLockedBox.vue'
import IsUnlockedBox from '@/components/Views/GroupView/IsUnlockedBox.vue'
import Message from '@common/components/Message.vue'
import GroupIcon from '@/components/Views/MainView/ListItems/GroupIcon.vue'

const route = useRoute()
const groupStore = useGroupStore()
const modalStore = useModalStore()

onMounted(() => (groupStore.selectedGroup = findGroup()))

const group = computed(() => groupStore.selectedGroup)

const redirectRoute = computed<RouteLocationRaw | undefined>(() => {
    const redirect = route.params.redirect
    return typeof redirect === 'string' ? redirect : undefined
})

const showButtons = computed<boolean>(() => {
    return group.value !== null && !group.value.isEncrypted
})

function findGroup(): Group | null {
    const id = route.params.id

    if (!id) {
        return null
    }

    return groupStore.get(Number(id))
}
</script>

<template>
    <View :redirect-route="redirectRoute">
        <template #controls>
            <Actions v-if="group && showButtons" :group />

            <Control @click="modalStore.show('groupMenu', {})">
                <EllipsisVerticalIcon style="width: 100%" />
            </Control>
        </template>

        <div v-if="group">
            <div class="flex items-center gap-2 relative my-2 px-2">
                <GroupIcon v-if="group.isPrivate" :group />

                <RouterLink
                    v-else
                    :to="{ name: 'groupIcon', params: { id: group.id } }"
                    class="rounded-md hover:bg-border p-0.5"
                >
                    <GroupIcon :group />
                </RouterLink>

                <h2 class="text-lg mt-0.5">{{ group.name }}</h2>
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
