<script setup lang="ts">
import type { Group } from '@common/types'
import { ref, onMounted } from 'vue'
import { trans } from '@common/modules'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useGroupStore } from '@/stores/group'
import { useFolderStore } from '@/stores/folder'
import { groupStorage } from '@common/modules/storage/group'
import View from '@/components/Views/View.vue'
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import Message from '@common/components/Message.vue'
import GroupIcon from '@/components/Views/MainView/ListItems/GroupIcon.vue'
import ListItems from '@/components/Views/MainView/ListItems/ListItems.vue'

const route = useRoute()
const modalStore = useModalStore()
const groupStore = useGroupStore()
const folderStore = useFolderStore()

const groups = ref<Group[]>([])

onMounted(async () => {
    groupStore.selectedGroup = null
    await fetchGroups()
})

async function fetchGroups(): Promise<void> {
    const id = route.params.id

    if (!id) {
        return
    }

    groups.value = await groupStorage.retrieveFolder(Number(id))
}
</script>

<template>
    <View>
        <template #controls>
            <Control @click="modalStore.show('folderMenu', {})">
                <EllipsisVerticalIcon style="width: 100%" />
            </Control>
        </template>

        <div v-if="folderStore.folder">
            <div class="flex items-center gap-2 relative my-2 px-2">
                <GroupIcon :folder="folderStore.folder" />
                <h2 class="text-lg mt-0.5">{{ folderStore.folder.name }}</h2>
            </div>

            <ListItems :groups @refresh="fetchGroups" />
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
