<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'

const { trans } = useTransStore()
const { openPopup } = usePopupStore()
const groupStore = useGroupStore()

function askForGroupName(isPrivate: boolean) {
    groupStore.newGroup.isPrivate = isPrivate
    openPopup('groupName')
}

const privateTip =
    'Private groups are secure and use encryption. Only users with the password can access them'
</script>

<template>
    <div class="flex items-center gap-2">
        <NewGroupButton
            @click="askForGroupName(false)"
            :disabled="groupStore.isSaving"
            class="w-full bg-primary hover:bg-primary-hover"
        >
            <PlusCircleIcon class="w-6 h-6" />
            <span>{{ trans('New Group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            v-tippy="trans(privateTip)"
            @click="askForGroupName(true)"
            class="w-24 bg-private hover:bg-private-hover"
            :disabled="groupStore.isSaving"
        >
            <ShieldCheckIcon class="w-8 h-8" />
        </NewGroupButton>
    </div>
</template>
