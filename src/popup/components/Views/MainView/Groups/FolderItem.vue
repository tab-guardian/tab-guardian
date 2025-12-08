<script setup lang="ts">
import type { Folder } from '@common/types'
import { useRouter } from 'vue-router'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'
import MainItem from '@/components/Views/MainView/Groups/MainItem.vue'

const props = defineProps<{ folder: Folder }>()
const router = useRouter()

async function navigateToFolderView(): Promise<void> {
    await router.push({ name: 'folder', params: { id: props.folder.id } })
}
</script>

<template>
    <MainItem @click="navigateToFolderView" class="bg-folder! hover:bg-folder-hover!">
        <div class="flex items-center gap-2">
            <GroupIcon :folder />
            <h2 class="text-sm">{{ folder.name }}</h2>
        </div>

        <div class="flex items-center gap-3">
            <ChevronRightIcon class="size-4" />
        </div>
    </MainItem>
</template>
