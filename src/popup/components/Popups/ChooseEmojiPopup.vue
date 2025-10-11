<script setup lang="ts">
import type { EmojiClickEventDetail } from 'emoji-picker-element/shared.js'
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import { isEmoji } from '@/modules/isEmoji'
import 'emoji-picker-element'
import Popup from '@/components/Popups/Popup.vue'
import PopupButton from '@/components/Popups/PopupButton.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { closePopup } = usePopupStore()
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

    closePopup('chooseEmoji', emoji.value)
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('chooseEmoji')"
        :content="trans('pick_any_emoji')"
    >
        <p v-if="emoji">{{ trans('your_emoji_is') }} {{ emoji }}</p>

        <emoji-picker v-on:emoji-click="chooseEmoji"></emoji-picker>

        <template #buttons>
            <PopupButton
                @click="closePopup('chooseEmoji')"
                :is-secondary="true"
            >
                {{ trans('cancel') }}
            </PopupButton>

            <PopupButton @click="submit" :disabled="preventSubmit">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </PopupButton>
        </template>
    </Popup>
</template>
