<script setup lang="ts">
import GroupItem from '@/components/MainScreen/Groups/GroupItem.vue'
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'

const groupStore = useGroupStore()
const { trans } = useTransStore()
</script>

<template>
    <h3 v-if="groupStore.groups.length === 0" class="message">
        {{ trans('There are no groups yet') }}
    </h3>

    <div v-else class="groups">
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
