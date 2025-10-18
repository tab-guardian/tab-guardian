<script setup lang="ts">
import type { EmojiClickEventDetail } from 'emoji-picker-element/shared.js'
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans, isEmoji } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import 'emoji-picker-element'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()
const emoji = ref<string>('')
const preventSubmit = computed<boolean>(() => !isEmoji(emoji.value))

onMounted(setInitialEmoji)

function setInitialEmoji(): void {
    const group = groupStore.selectedGroup

    if (!group || !group.icon) {
        return
    }

    if (isEmoji(group.icon)) {
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
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        console.warn('No group selected rebinding URL')
        return
    }

    hideEmojiPopup()
}

function hideEmojiPopup(): void {
    popupStore.hide('chooseEmoji', { emo: emoji.value })
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="hideEmojiPopup"
        :content="trans('pick_any_emoji')"
    >
        <p v-if="emoji">{{ trans('your_emoji_is') }} {{ emoji }}</p>

        <emoji-picker v-on:emoji-click="chooseEmoji"></emoji-picker>

        <template #buttons>
            <Button @click="hideEmojiPopup" is="outline">
                {{ trans('cancel') }}
            </Button>

            <Button @click="submit" :disabled="preventSubmit">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </template>
    </Popup>
</template>
