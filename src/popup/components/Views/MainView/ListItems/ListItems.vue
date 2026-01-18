<script setup lang="ts">
import type { Group, Folder } from '@common/types'
import { computed, ref } from 'vue'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { config } from '@common/config'
import { VueDraggableNext } from 'vue-draggable-next'
import GroupItem from '@/components/Views/MainView/ListItems/GroupItem.vue'
import Message from '@common/components/Message.vue'
import Spinner from '@common/components/Spinner.vue'
import FolderItem from '@/components/Views/MainView/ListItems/FolderItem.vue'
import DropArea from '@/components/DropArea.vue'

const groupStore = useGroupStore()

type Props = {
    groups: Group[]
    folders?: Folder[]
}

const props = withDefaults(defineProps<Props>(), {
    folders: () => [],
})

const emit = defineEmits<{ (e: 'refresh'): void }>()

const isDragging = ref<boolean>(false)
const draggableGroup = ref<number | null>(null)
const groups = computed(() => props.groups)

function moveToFolder(e: any): void {
    isDragging.value = false

    const folderElem = e.explicitOriginalTarget as HTMLElement
    const groupElem = e.item as HTMLElement

    const groupValue = groupElem.getAttribute('data-group-id')
    const folderValue = folderElem.getAttribute('data-folder-id')

    if (!folderValue || !groupValue) {
        return
    }

    const folderId = Number(folderValue)
    const groupId = Number(groupValue)

    groupStore.update(groupId, { folderId })
    groupStore.load()
}

function showDropZone(e: any): void {
    isDragging.value = true

    const groupElem = e.item
    const groupValue = groupElem.getAttribute('data-group-id')

    if (!groupValue) {
        return
    }

    draggableGroup.value = Number(groupValue)
}

async function moveFromFolder(e: any): Promise<void> {
    const dropZone = e.originalTarget as HTMLElement | null

    if (
        !dropZone ||
        !dropZone.hasAttribute('data-dropzone') ||
        !draggableGroup.value
    ) {
        return
    }

    await groupStore.update(draggableGroup.value, {
        folderId: config.GROUP_MISSING_FOLDER,
    })

    emit('refresh')

    draggableGroup.value = null
    isDragging.value = false
}
</script>

<template>
    <Spinner v-if="groupStore.loading" />

    <Message v-else-if="groups.length === 0 && folders.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col border-t border-border">
        <DropArea
            v-if="isDragging && folders.length === 0"
            @is-dropped="moveFromFolder"
            :label="trans('drop_to_remove')"
        />

        <VueDraggableNext
            :sort="false"
            @start="showDropZone"
            @end="moveToFolder"
            v-model="groups"
            item-key="id"
        >
            <FolderItem
                v-for="folder in folders"
                :key="folder.id"
                :data-folder-id="folder.id"
                :folder
            />

            <div v-for="group in groups" :key="group.id" :data-group-id="group.id">
                <GroupItem v-if="!group.hide" :group />
            </div>
        </VueDraggableNext>
    </div>
</template>
