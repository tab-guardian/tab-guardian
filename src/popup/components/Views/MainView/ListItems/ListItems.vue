<script setup lang="ts">
import type { Group, Folder } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { VueDraggableNext } from 'vue-draggable-next'
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

const groups = computed(() => props.groups)

function moveToFolder(e: any): void {
    const folderElem = e.explicitOriginalTarget as HTMLElement
    const groupElem = e.item as HTMLElement

    const folderValue = folderElem.dataset.folder
    const groupValue = groupElem.dataset.group

    if (!folderValue || !groupValue) {
        return
    }

    const folderId = Number(folderValue)
    const groupId = Number(groupValue)

    groupStore.update(groupId, { folderId })
    groupStore.load()
}
</script>

<template>
    <Spinner v-if="groupStore.loading" />

    <Message v-else-if="groups.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col border-t border-border">
        <VueDraggableNext
            :sort="false"
            @end="moveToFolder"
            v-model="groups"
            item-key="id"
        >
            <FolderItem
                v-for="folder in folders"
                :key="folder.id"
                :data-folder="folder.id"
                :folder
            />

            <div v-for="group in groups" :key="group.id" :data-group="group.id">
                <GroupItem v-if="!group.hide" :group />
            </div>
        </VueDraggableNext>
    </div>
</template>
