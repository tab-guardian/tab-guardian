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
const draggedGroupId = ref<number | null>(null)
const groups = computed(() => props.groups)
const visibleGroups = computed(() => props.groups.filter(group => !group.hide))

function findElementUnderPointer(e: DragEvent | undefined): HTMLElement | null {
    const el = e ? document.elementFromPoint(e.clientX, e.clientY) : null
    return (el as HTMLElement | null) ?? null
}

function findFolderUnderPointer(e: DragEvent | undefined): HTMLElement | null {
    return findElementUnderPointer(e)?.closest?.('[data-folder-id]') ?? null
}

function findDropZoneUnderPointer(e: DragEvent | undefined): HTMLElement | null {
    return findElementUnderPointer(e)?.closest?.('[data-dropzone]') ?? null
}

function resetDragState(): void {
    draggedGroupId.value = null
    isDragging.value = false
}

async function moveGroupToFolder(groupId: number, folderId: number): Promise<void> {
    await groupStore.updateFields(groupId, { folderId })
    await groupStore.load()
}

async function moveGroupToRoot(groupId: number): Promise<void> {
    await groupStore.updateFields(groupId, {
        folderId: config.GROUP_MISSING_FOLDER,
    })

    emit('refresh')
}

async function handleSortableDragEnd(e: any): Promise<void> {
    const pointerEvent = e.originalEvent as DragEvent | undefined
    const groupElem = e.item as HTMLElement | undefined

    if (findDropZoneUnderPointer(pointerEvent)) {
        if (draggedGroupId.value) {
            await moveGroupToRoot(draggedGroupId.value)
        }
        resetDragState()
        return
    }

    const folderElem = findFolderUnderPointer(pointerEvent)

    if (!folderElem || !groupElem) {
        resetDragState()
        return
    }

    const groupId = groupElem.getAttribute('data-group-id')
    const folderId = folderElem.getAttribute('data-folder-id')

    if (!folderId || !groupId) {
        resetDragState()
        return
    }

    await moveGroupToFolder(Number(groupId), Number(folderId))

    resetDragState()
}

function handleDragStart(e: any): void {
    isDragging.value = true

    const groupElem = e.item
    const groupValue = groupElem.getAttribute('data-group-id')

    if (!groupValue) {
        return
    }

    draggedGroupId.value = Number(groupValue)
}

async function handleDropZoneDrop(e: DragEvent): Promise<void> {
    const target = e.target as HTMLElement | null
    const dropZone = target?.closest?.('[data-dropzone]') ?? null

    if (!dropZone || !draggedGroupId.value) {
        return
    }

    await moveGroupToRoot(draggedGroupId.value)

    resetDragState()
}
</script>

<template>
    <Spinner v-if="groupStore.loading" />

    <Message v-else-if="visibleGroups.length === 0 && folders.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col border-t border-border">
        <DropArea
            v-if="isDragging && folders.length === 0"
            @is-dropped="handleDropZoneDrop"
            :label="trans('drop_to_remove')"
        />

        <VueDraggableNext
            :sort="false"
            @start="handleDragStart"
            @end="handleSortableDragEnd"
            v-model="groups"
            item-key="id"
        >
            <FolderItem
                v-for="folder in folders"
                :key="folder.id"
                :data-folder-id="folder.id"
                :folder
            />

            <div
                v-for="group in visibleGroups"
                :key="group.id"
                :data-group-id="group.id"
            >
                <GroupItem :group />
            </div>
        </VueDraggableNext>
    </div>
</template>
