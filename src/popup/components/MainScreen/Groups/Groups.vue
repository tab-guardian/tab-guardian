<script setup lang="ts">
import GroupItem from '@/components/MainScreen/Groups/GroupItem.vue'
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
</style>
