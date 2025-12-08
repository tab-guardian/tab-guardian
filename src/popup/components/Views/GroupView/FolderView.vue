<script setup lang="ts">
import type { Folder } from '@common/types'
import { ref, onMounted } from 'vue'
import { trans } from '@common/modules'
import { useRoute } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { folderStorage } from '@common/modules/storage/folder'
import View from '@/components/Views/View.vue'
import EllipsisVerticalIcon from '@common/components/Icons/EllipsisVerticalIcon.vue'
import Control from '@/components/Control.vue'
import Message from '@common/components/Message.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'

const route = useRoute()
const popupStore = usePopupStore()
const folder = ref<Folder | null>(null)

onMounted(() => fetchFolder())

async function fetchFolder(): Promise<void> {
    const id = route.params.id

    if (!id) {
        return
    }

    folder.value = await folderStorage.get(Number(id))
}
</script>

<template>
    <View :routeLocation="{ name: 'main' }">
        <template #controls>
            <Control @click="popupStore.show('groupMenuView', {})">
                <EllipsisVerticalIcon style="width: 100%" />
            </Control>
        </template>

        <div v-if="folder">
            <div class="flex items-center gap-2 relative my-2 px-2">
                <GroupIcon v-if="folder" :folder />
                <h2 class="text-lg mt-0.5">{{ folder.name }}</h2>
            </div>

            <!-- <Links v-if="!folder.isEncrypted" :folder /> -->
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
