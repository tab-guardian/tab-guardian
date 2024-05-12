<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircleIcon.vue'

const { trans } = useTransStore()
const { openPopup } = usePopupStore()
const groupStore = useGroupStore()

function askForGroupName(isPrivate: boolean) {
    groupStore.newGroup.isPrivate = isPrivate
    openPopup('groupName')
}
</script>

<template>
    <div class="buttons">
        <button
            @click="askForGroupName(false)"
            :disabled="groupStore.isSaving"
            class="btn save"
            type="button"
        >
            <PlusCircleIcon />
            <span>{{ trans('New Group') }}</span>
        </button>

        <button
            @click="askForGroupName(true)"
            class="btn save-private"
            type="button"
            :disabled="groupStore.isSaving"
        >
            <ShieldCheckIcon />
        </button>
    </div>
</template>

<style lang="sass" scoped>
.buttons
    display: flex
    align-items: center
    gap: 8px

    .btn
        height: 37px
        border: none
        font-size: 1rem
        line-height: 15px
        display: flex
        gap: 10px
        align-items: center
        justify-content: center
        color: var(--tg-color-bg-secondary)
        cursor: pointer
        transition: opacity .2s
        border-radius: 8px
        transition: opacity .2s

        &:hover
            opacity: .9

        &:disabled
            opacity: .5
            cursor: not-allowed

    .save
        width: 100%
        background-color: var(--tg-color-primary)
        border: 2px solid var(--dark-blue)

        svg
            width: 22px
            height: 22px

    .save-private
        width: 90px
        background-color: var(--tg-color-secondary)

        svg
            width: 25px
            height: 25px
</style>
