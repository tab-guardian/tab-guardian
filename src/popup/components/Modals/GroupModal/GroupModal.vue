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

            <div v-if="groupModal.selectedGroup" class="group">
                <h2>Group: {{ groupModal.selectedGroup.title }}</h2>

                <ul class="group__links">
                    <li
                        v-for="link in groupModal.selectedGroup.links"
                        :key="link.id"
                    >
                        <a
                            :href="link.url"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img :src="link.favIconUrl" alt="icon" />

                            <span>
                                {{ link.title }}
                                <small>{{ link.url }}</small>
                            </span>
                        </a>
                    </li>
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

        li
            a
                display: flex
                align-items: center
                gap: 10px
                background-color: #fff
                transition: background-color .2s
                cursor: pointer
                border: 1px solid var(--tg-color-border-default)
                border-radius: 8px
                background-color: var(--tg-color-light)
                padding: 8px
                text-decoration: none
                color: var(--tg-color-text-default)
                font-size: .9rem

                &:hover
                    background-color: var(--tg-color-light-hover)

                img
                    width: 25px
                    height: 25px
                    border-radius: 4px

                span
                    display: flex
                    flex-direction: column

                    small
                        color: var(--tg-color-text-gray)

.no-group
    font-size: .8rem
    padding: 10px
    text-align: center
</style>
