<script setup lang="ts">
import { useNewGroupStore } from '@/stores/newGroup'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { onMounted } from 'vue'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import NewGroupButton from '@/components/Views/MainView/NewGroup/NewGroupButton.vue'

onMounted(() => newGroupStore.resetChoices())

const { openPopup } = usePopupStore()
const newGroupStore = useNewGroupStore()

function askForGroupName(isPrivate: boolean) {
    newGroupStore.choices.isPrivate = isPrivate
    openPopup('newGroupName')
}
</script>

<template>
    <div class="flex items-center gap-2">
        <NewGroupButton
            @click="askForGroupName(false)"
            class="w-full bg-primary hover:bg-primary-hover"
        >
            <PlusCircleIcon class="w-6 h-6" />
            <span>{{ trans('new_group') }}</span>
        </NewGroupButton>

        <NewGroupButton
            v-tippy="trans('private_groups_are_secure')"
            @click="askForGroupName(true)"
            class="w-24 bg-private hover:bg-private-hover"
        >
            <ShieldCheckIcon class="w-8 h-8" />
        </NewGroupButton>
    </div>
</template>
