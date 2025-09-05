<script setup lang="ts">
import type { EmojiClickEventDetail } from 'emoji-picker-element/shared.js'
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { error } from '@common/modules/error'
import { containsEmoji } from '@common/modules/emoji/containsEmoji'
import { isSingleEmoji } from '@common/modules/emoji/isSingleEmoji'
import 'emoji-picker-element'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const initialEmoji = ref<string>('')
const emoji = ref<string>('')

const preventSubmit = computed<boolean>(
    () => !isSingleEmoji(emoji.value) || !containsEmoji(emoji.value),
)

onMounted(setInitialEmoji)

function setInitialEmoji(): void {
    const group = groupStore.selectedGroup

    if (!group || !group.icon) {
        return
    }

    if (isSingleEmoji(group.icon)) {
        emoji.value = group.icon
        initialEmoji.value = group.icon
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
        error.warn('No group selected rebinding URL')
        return
    }

    closePopup('chooseEmoji', emoji.value)
}

function cancel(): void {
    emoji.value = initialEmoji.value
    closePopup('chooseEmoji', initialEmoji.value)
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

        <div class="flex gap-4 items-center justify-end mt-4">
            <Button
                @click="cancel"
                additionalClasses="!bg-transparent !text-font"
            >
                {{ trans('cancel') }}
            </Button>

            <Button @click="submit" :disabled="preventSubmit">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </div>
    </Popup>
</template>
