<script setup lang="ts">
import { onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import ListItems from '@/components/Views/MainView/ListItems/ListItems.vue'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'
import GroupSearch from '@/components/Views/MainView/NewGroup/GroupSearch.vue'

const groupStore = useGroupStore()
const folderStore = useFolderStore()

onMounted(async () => {
    groupStore.selectedGroup = null
    await load()
})

async function load(): Promise<void> {
    await groupStore.load()
    await folderStore.load()
}
</script>

<template>
    <div>
        <div class="text-center p-2">
            <Buttons @refresh="load" />
            <GroupSearch />
        </div>

        <ListItems :groups="groupStore.groups" :folders="folderStore.folders" />
    </div>
</template>
