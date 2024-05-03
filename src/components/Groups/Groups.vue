<script setup lang="ts">
import GroupItem from '@/components/Groups/GroupItem.vue'
import { useGroupStore } from '@/stores/groupStore'

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
    margin: 15px 7pox
</style>