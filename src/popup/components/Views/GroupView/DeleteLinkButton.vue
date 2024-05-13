<script setup lang="ts">
import CloseIcon from '@/components/Icons/CloseIcon.vue'
import { useGroupStore } from '@/stores/group'

type Props = {
    linkId: number
    groupId: number
}

const { linkId, groupId } = defineProps<Props>()

const groupStore = useGroupStore()
</script>

<template>
    <div
        @click.prevent="groupStore.deleteLink(groupId, linkId)"
        class="delete-button"
    >
        <CloseIcon width="15" height="15" />
    </div>
</template>

<style lang="sass" scoped>
.delete-button
    display: flex
    align-items: center
    color: var(--tg-color-font)
    padding: 3px 0
    border-radius: 4px
    transition: background-color .2s, border-color .2s
    border: 1px solid transparent

    &:hover
        background-color: var(--tg-color-bg)
        border-color: var(--tg-color-border)
</style>
