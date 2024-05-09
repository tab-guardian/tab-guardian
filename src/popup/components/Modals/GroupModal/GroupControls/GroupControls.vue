<script setup lang="ts">
import BackButton from '@/components/Modals/GroupModal/GroupControls/BackButton.vue'
import DeleteGroupButton from '@/components/Modals/GroupModal/GroupControls/DeleteGroupButton.vue'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'

const groupModalStore = useGroupModalStore()

function toMainScreen(): void {
    groupModalStore.reset()
}
</script>

<template>
    <div class="controls">
        <BackButton @click="toMainScreen" />

        <div>
            <DeleteGroupButton @click="groupModalStore.askToDelete = true" />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.controls
    display: flex
    justify-content: space-between
</style>
