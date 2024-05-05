<script setup lang="ts">
import GroupItem from '@/components/Screens/MainScreen/Groups/GroupItem.vue'
import { useGroupStore } from '@/stores/useGroupStore'

const groupStore = useGroupStore()
</script>

<template>
    <div class="groups">
        <GroupItem
            v-for="group in groupStore.groups"
            :key="group.id"
            :group="group"
        />
    </div>
</template>

<style lang="sass" scoped>
.groups
    display: flex
    flex-direction: column
    height: 410px
    overflow-y: auto

    &::-webkit-scrollbar
        width: 7px

    &::-webkit-scrollbar-track
        background-color: var(--tg-scrollbar-bg)
        border-radius: 50px
        margin-top: 2px

    &::-webkit-scrollbar-thumb
        background-color: var(--tg-scrollbar-bg-thumb)
        border-radius: 10px
        border-radius: 50px
</style>