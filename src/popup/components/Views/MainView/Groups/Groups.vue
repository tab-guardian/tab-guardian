<script setup lang="ts">
import { onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import trans from '@common/modules/trans'
import GroupItem from '@/components/Views/MainView/Groups/GroupItem.vue'
import Message from '@common/components/Message.vue'

const store = useGroupStore()

onMounted(async () => {
    store.selectedGroup = null
    await store.loadGroupsFromStorage()
})
</script>

<template>
    <Message v-if="store.groups.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col">
        <div v-for="group in store.groups" :key="group.id">
            <GroupItem :group="group" v-if="!group.hide" />
        </div>
    </div>
</template>
