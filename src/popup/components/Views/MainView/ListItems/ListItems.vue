<script setup lang="ts">
import type { Group, Folder } from '@common/types'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import GroupItem from '@/components/Views/MainView/ListItems/GroupItem.vue'
import Message from '@common/components/Message.vue'
import Spinner from '@common/components/Spinner.vue'
import FolderItem from '@/components/Views/MainView/ListItems/FolderItem.vue'

const groupStore = useGroupStore()

type Props = {
    groups: Group[]
    folders?: Folder[]
}

const props = withDefaults(defineProps<Props>(), {
    folders: () => [],
})
</script>

<template>
    <Spinner v-if="groupStore.loading" />

    <Message v-else-if="groups.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col">
        <FolderItem v-for="folder in folders" :key="folder.name" :folder />

        <div v-for="group in groups" :key="group.id">
            <GroupItem v-if="!group.hide" :group />
        </div>
    </div>
</template>
