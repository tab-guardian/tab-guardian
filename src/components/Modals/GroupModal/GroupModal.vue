<script setup lang="ts">
import { useGroupModal } from '@/stores/modals/useGroupModal'
import { useTransStore } from '@/stores/useTransStore'
import GroupControls from '@/components/Modals/GroupModal/GroupControls/GroupControls.vue'
import Modal from '@/components/Modal.vue'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'

const groupModal = useGroupModal()
const { trans } = useTransStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal v-if="groupModal.selectedGroup">
            <GroupControls />

            <div v-if="groupModal.selectedGroup">
                <h2>Group: {{ groupModal.selectedGroup.title }}</h2>
            </div>

            <div v-else class="no-group">
                <h2>{{ trans('Something went wrong! No group selected') }}</h2>
            </div>
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.no-group
    font-size: .8rem
    padding: 10px
    text-align: center
</style>
