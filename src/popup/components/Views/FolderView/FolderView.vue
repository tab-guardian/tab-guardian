<script setup lang="ts">
import { Group, type Folder } from '@common/types'
import { ref, onMounted } from 'vue'
import { trans } from '@common/modules'
import { useRoute } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { folderStorage } from '@common/modules/storage/folder'
import { useGroupStore } from '@/stores/group'
import { groupStorage } from '@common/modules/storage/group'
import View from '@/components/Views/View.vue'
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import Message from '@common/components/Message.vue'
import GroupIcon from '@/components/Views/MainView/ListItems/GroupIcon.vue'
import ListItems from '@/components/Views/MainView/ListItems/ListItems.vue'

const route = useRoute()
const popupStore = usePopupStore()
const groupStore = useGroupStore()
const groups = ref<Group[]>([])

const folder = ref<Folder | null>(null)

onMounted(async () => {
    groupStore.selectedGroup = null
    await fetchFolder()
})

async function fetchFolder(): Promise<void> {
    const id = route.params.id

    if (!id) {
        return
    }

    folder.value = await folderStorage.get(Number(id))
    groups.value = await groupStorage.retrieveFolder(Number(id))
}
</script>

<template>
    <View>
        <template #controls>
            <Control @click="popupStore.show('groupMenu', {})">
                <EllipsisVerticalIcon style="width: 100%" />
            </Control>
        </template>

        <div v-if="folder">
            <div class="flex items-center gap-2 relative my-2 px-2">
                <GroupIcon v-if="folder" :folder />
                <h2 class="text-lg mt-0.5">{{ folder.name }}</h2>
            </div>

            <ListItems :groups @refresh-folder="fetchFolder" />
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
