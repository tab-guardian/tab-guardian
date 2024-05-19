<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import { useSettingsStore } from '@/stores/settings'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'
import showToast from '@common/modules/showToast'

const { trans } = useTransStore()
const { openPopup } = usePopupStore()
const groupStore = useGroupStore()
const settingsStore = useSettingsStore()

function askForGroupName(isPrivate: boolean) {
    groupStore.newGroup.isPrivate = isPrivate

    if (isPrivate && !settingsStore.settings.password) {
        const msg = trans(
            'To create a private group, you need to set a password in settings',
        )
        showToast(msg, 'error', 4000)
        return
    }

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
            <span>{{ trans('New Group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            @click="askForGroupName(true)"
            class="w-24 bg-private hover:bg-private-hover"
            :disabled="groupStore.isSaving"
        >
            <ShieldCheckIcon class="w-8 h-8" />
        </NewGroupButton>
    </div>
</template>
