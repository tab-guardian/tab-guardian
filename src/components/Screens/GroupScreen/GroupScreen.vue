<script setup lang="ts">
import { useScreenStore } from '@/stores/useScreenStore'
import { useTransStore } from '@/stores/useTransStore'
import GroupControls from '@/components/Screens/GroupScreen/GroupControls/GroupControls.vue'

const screenStore = useScreenStore()
const { trans } = useTransStore()
</script>

<template>
    <div class="group-screen">
        <GroupControls />

        <div v-if="screenStore.selectedGroup">
            <h2>Group: {{ screenStore.selectedGroup.title }}</h2>
        </div>

        <div v-else class="no-group">
            <h2>{{ trans('Something went wrong! No group selected') }}</h2>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.group-screen
    padding: var(--tg-padding)

    .no-group
        font-size: .8rem
        padding: 10px
        text-align: center
</style>
