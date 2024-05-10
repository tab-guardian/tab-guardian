<script setup lang="ts">
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useTransStore } from '@/stores/useTransStore'
import GroupControls from '@/components/Modals/GroupModal/GroupControls/GroupControls.vue'
import Modal from '@/components/Modal.vue'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import Links from '@/components/Modals/GroupModal/Links.vue'
import GroupTitle from '@/components/Modals/GroupModal/GroupTitle.vue'

const groupModalStore = useGroupModalStore()
const { trans } = useTransStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal v-if="groupModalStore.selectedGroup">
            <GroupControls />

            <div v-if="groupModalStore.selectedGroup" class="group">
                <GroupTitle :title="groupModalStore.selectedGroup.title" />
                <Links :group="groupModalStore.selectedGroup" />
            </div>

            <div v-else class="message">
                <h2>😢 {{ trans('Something went wrong! No group selected') }}</h2>
            </div>
        </Modal>
    </LeftSlideTransition>
</template>