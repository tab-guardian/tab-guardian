<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'

const { openPopup } = usePopupStore()
const groupStore = useGroupStore()

function askForGroupName(isPrivate: boolean) {
    groupStore.newGroup.isPrivate = isPrivate
    openPopup('groupName')
}
</script>

<template>
    <div class="flex items-center gap-2">
        <NewGroupButton
            @click="askForGroupName(false)"
            :disabled="groupStore.isSaving"
            class="w-full bg-primary hover:bg-primary-hover"
        >
            <PlusCircleIcon class="w-6 h-6" />
            <span>{{ trans('new_group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            v-tippy="trans('private_groups_are_secure')"
            @click="askForGroupName(true)"
            class="w-24 bg-private hover:bg-private-hover"
            :disabled="groupStore.isSaving"
        >
            <ShieldCheckIcon class="w-8 h-8" />
        </NewGroupButton>
    </div>
</template>
