<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { useModalStore } from '@/stores/useModalStore'
import Modal from '@/components/Modals/Modal.vue'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import Links from '@/components/Modals/GroupModal/Links.vue'
import GroupTitle from '@/components/Modals/GroupModal/GroupTitle.vue'
import MenuButton from '@/components/Modals/GroupModal/GroupControls/MenuButton.vue'

const store = useGroupStore()
const { trans } = useTransStore()
const { isOpenModal } = useModalStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal
            v-if="isOpenModal('group') && store.selectedGroup"
            @goBack="store.goBack"
        >
            <template #controls>
                <MenuButton />
            </template>

            <div v-if="store.selectedGroup" class="group">
                <GroupTitle :group="store.selectedGroup" />
                <Links :group="store.selectedGroup" />
            </div>

            <div v-else class="message">
                <h2>
                    😢 {{ trans('Something went wrong! No group selected') }}
                </h2>
            </div>
        </Modal>
    </LeftSlideTransition>
</template>
