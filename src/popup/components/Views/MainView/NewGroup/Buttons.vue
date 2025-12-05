<script setup lang="ts">
import { useNewGroupStore } from '@/stores/newGroup'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { onMounted } from 'vue'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import FolderPlusIcon from '@common/components/Icons/FolderPlusIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'

onMounted(() => newGroupStore.resetChoices())

const popupStore = usePopupStore()
const newGroupStore = useNewGroupStore()

async function askForGroupName(isPrivate: boolean) {
    newGroupStore.choices.isPrivate = isPrivate
    await popupStore.show('groupName', {})
}
</script>

<template>
    <div class="flex items-center gap-2">
        <NewGroupButton
            @click="askForGroupName(false)"
            class="w-full bg-primary hover:bg-primary-hover"
        >
            <PlusCircleIcon class="size-6" />
            <span>{{ trans('new_group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            v-tippy="trans('private_groups_are_secure')"
            @click="askForGroupName(true)"
            class="w-24 bg-success hover:bg-success-hover"
        >
            <ShieldCheckIcon class="size-7" />
        </NewGroupButton>

        <button
            @click="popupStore.show('folderName', {})"
            class="w-14 flex justify-center hover:scale-105 transition-transform"
            v-tippy="trans('create_new_folder')"
        >
            <FolderPlusIcon class="size-6 text-font" />
        </button>
    </div>
</template>
