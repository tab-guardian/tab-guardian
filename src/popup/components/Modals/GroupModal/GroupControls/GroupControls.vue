<script setup lang="ts">
import BackButton from '@/components/Modals/GroupModal/GroupControls/BackButton.vue'
import { useGroupModal } from '@/stores/modals/useGroupModal'

const groupModal = useGroupModal()

function toMainScreen(): void {
    groupModal.reset()
}
</script>

<template>
    <div class="controls">
        <BackButton @click="toMainScreen" />
    </div>
</template>

<style lang="sass" scoped>
.controls
    display: flex
    justify-content: space-between
</style>
