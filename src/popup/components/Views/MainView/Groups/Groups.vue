<script setup lang="ts">
import GroupItem from '@/components/Views/MainView/Groups/GroupItem.vue'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'

const store = useGroupStore()
const { trans } = useTransStore()
</script>

<template>
    <h3 v-if="store.groups.length === 0" class="message">
        {{ trans('There are no groups yet') }}
    </h3>

    <div v-else class="groups">
        <GroupItem
            v-for="group in store.groups"
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
