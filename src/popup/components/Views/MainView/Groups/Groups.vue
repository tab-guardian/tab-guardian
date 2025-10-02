<script setup lang="ts">
import { onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import GroupItem from '@/components/Views/MainView/Groups/GroupItem.vue'
import Message from '@common/components/Message.vue'
import Spinner from '@common/components/Spinner.vue'

const groupStore = useGroupStore()

onMounted(async () => {
    groupStore.selectedGroup = null
    await groupStore.loadGroupsFromStorage()
})
</script>

<template>
    <Spinner v-if="groupStore.loadingGroups" />

    <Message v-else-if="groupStore.groups.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col">
        <div v-for="group in groupStore.groups" :key="group.id">
            <GroupItem v-if="!group.hide" :group />
        </div>
    </div>
</template>
