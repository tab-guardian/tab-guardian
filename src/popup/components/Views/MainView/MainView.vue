<script setup lang="ts">
import { onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import Groups from '@/components/Views/MainView/Groups/Groups.vue'
import Buttons from '@/components/Views/MainView/NewGroup/Buttons.vue'
import GroupSearch from '@/components/Views/MainView/NewGroup/GroupSearch.vue'

const groupStore = useGroupStore()
const folderStore = useFolderStore()

onMounted(async () => {
    groupStore.selectedGroup = null
    await groupStore.load()
    await folderStore.load()
})
</script>

<template>
    <div>
        <div class="text-center p-2 border-b border-border">
            <Buttons />
            <GroupSearch />
        </div>

        <Groups :groups="groupStore.groups" :folders="folderStore.folders" />
    </div>
</template>
