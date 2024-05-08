<script setup lang="ts">
import { useGroupModal } from '@/stores/modals/useGroupModal'
import { useTransStore } from '@/stores/useTransStore'
import GroupControls from '@/components/Modals/GroupModal/GroupControls/GroupControls.vue'
import Modal from '@/components/Modal.vue'
import LeftSlideTransition from '@/components/Transitions/LeftSlideTransition.vue'
import LinkItem from '@/components/Modals/GroupModal/LinkItem.vue'

const groupModal = useGroupModal()
const { trans } = useTransStore()
</script>

<template>
    <LeftSlideTransition>
        <Modal v-if="groupModal.selectedGroup">
            <GroupControls />

            <div v-if="groupModal.selectedGroup" class="group">
                <h2>Group: {{ groupModal.selectedGroup.title }}</h2>

                <ul class="group__links">
                    <LinkItem
                        v-for="link in groupModal.selectedGroup.links"
                        :key="link.id"
                        :link="link"
                    />
                </ul>
            </div>

            <div v-else class="no-group">
                <h2>😢 {{ trans('Something went wrong! No group selected') }}</h2>
            </div>
        </Modal>
    </LeftSlideTransition>
</template>

<style lang="sass" scoped>
.group
    h2
        font-size: 1rem

    &__links
        list-style: none
        padding: 0
        margin: 0
        display: flex
        flex-direction: column
        gap: 7px

.no-group
    font-size: .8rem
    padding: 10px
    text-align: center
</style>
