<script setup lang="ts">
import type { EmojiClickEventDetail } from 'emoji-picker-element/shared.js'
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans, logger } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import 'emoji-picker-element'
import Modal from '@/components/Modals/Modal.vue'
import Button from '@common/components/Form/Button.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const modalStore = useModalStore()
const groupStore = useGroupStore()
const emoji = ref<string>('')

onMounted(setInitialEmoji)

function setInitialEmoji(): void {
    const group = groupStore.selectedGroup

    if (!group || !group.icon) {
        return
    }

    if (!group.icon) {
        emoji.value = group.icon
    }
}

async function chooseEmoji(e: CustomEvent): Promise<void> {
    const data = e.detail as EmojiClickEventDetail

    if (data.unicode) {
        emoji.value = data.unicode
    }
}

function submit(): void {
    if (!emoji.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        logger().warn('No group selected rebinding URL')
        return
    }

    modalStore.hide('chooseEmoji', { emo: emoji.value })
}

function hideEmojiModal(): void {
    modalStore.hide('chooseEmoji', {})
}
</script>

<template>
    <Modal
        v-if="groupStore.selectedGroup"
        @cancel="hideEmojiModal"
        :title="trans('pick_any_emoji')"
    >
        <p v-if="emoji">{{ trans('your_emoji_is') }} {{ emoji }}</p>

        <emoji-picker v-on:emoji-click="chooseEmoji"></emoji-picker>

        <template #buttons>
            <Button @click="hideEmojiModal" is="outline">
                {{ trans('cancel') }}
            </Button>

            <Button @click="submit" :disabled="!emoji">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </template>
    </Modal>
</template>
