<script setup lang="ts">
import BackButton from '@/components/Modals/GroupModal/GroupControls/BackButton.vue'
import DeleteGroupButton from '@/components/Modals/GroupModal/GroupControls/DeleteGroupButton.vue'
import { useGroupModal } from '@/stores/modals/useGroupModal'

const groupModal = useGroupModal()

function toMainScreen(): void {
    groupModal.reset()
}
</script>

<template>
    <div class="controls">
        <BackButton @click="toMainScreen" />

        <div>
            <DeleteGroupButton @click="groupModal.askToDelete = true" />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.controls
    display: flex
    justify-content: space-between
</style>
