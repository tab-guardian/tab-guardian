<script setup lang="ts">
import GroupItem from '@/components/MainScreen/Groups/GroupItem.vue'
import { useGroupStore } from '@/stores/useGroupStore'
import DeleteGroupPopup from '@/components/Modals/GroupModal/DeleteGroupPopup.vue'

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

    <DeleteGroupPopup />
</template>

<style lang="sass" scoped>
.groups
    display: flex
    flex-direction: column
</style>
