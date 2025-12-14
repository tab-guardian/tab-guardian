<script setup lang="ts">
import type { Group, Folder } from '@common/types'
import { computed, ref } from 'vue'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { VueDraggableNext } from 'vue-draggable-next'
import GroupItem from '@/components/Views/MainView/ListItems/GroupItem.vue'
import Message from '@common/components/Message.vue'
import Spinner from '@common/components/Spinner.vue'
import FolderItem from '@/components/Views/MainView/ListItems/FolderItem.vue'
import ArrowRightIcon from '@common/components/Icons/ArrowRightIcon.vue'

const groupStore = useGroupStore()

type Props = {
    groups: Group[]
    folders?: Folder[]
}

const props = withDefaults(defineProps<Props>(), {
    folders: () => [],
})

const emit = defineEmits<{ (e: 'refresh-folder'): void }>()

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

    await groupStore.update(draggableGroup.value, { folderId: undefined })

    emit('refresh-folder')

    draggableGroup.value = null
}
</script>

<template>
    <Spinner v-if="groupStore.loading" />

    <Message v-else-if="groups.length === 0 && folders.length === 0">
        {{ trans('no_groups_yet') }}
    </Message>

    <div v-else class="flex flex-col border-t border-border">
        <div
            v-if="isDragging && folders.length === 0"
            @dragenter.prevent
            @dragover.prevent
            @drop.prevent="moveFromFolder"
            data-dropzone
            :class="[
                'border-3 border-border border-dashed rounded-md h-14 leading-4',
                'mt-3 mb-1 flex items-center justify-center gap-2 p-2',
            ]"
        >
            <ArrowRightIcon
                class="size-5 rotate-180 opacity-50 pointer-events-none"
            />
            <span class="opacity-50 pointer-events-none">{{
                trans('drop_to_remove')
            }}</span>
        </div>

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
