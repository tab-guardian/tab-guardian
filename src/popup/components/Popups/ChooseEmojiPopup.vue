<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { error } from '@common/modules/error'
import { containsEmoji } from '@common/modules/emoji/containsEmoji'
import { isSingleEmoji } from '@common/modules/emoji/isSingleEmoji'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()
const emoji = ref<string>('')

const preventSubmit = computed<boolean>(
    () => !isSingleEmoji(emoji.value) || !containsEmoji(emoji.value),
)

const errorMessage = computed<string | null>(() => {
    if (emoji.value.length === 0) {
        return null
    }

    if (preventSubmit.value) {
        return trans('input_one_emoji')
    }

    return null
})

async function chooseEmoji(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        error.warn('No group selected rebinding URL')
        return
    }

    closePopup('chooseEmoji', emoji.value)
}
</script>

<template>
    <Popup
        v-if="groupStore.selectedGroup"
        @cancel="closePopup('chooseEmoji')"
        :content="trans('enter_any_emoji')"
        :description="trans('any_emoji_as_group_icon')"
    >
        <form @submit.prevent="chooseEmoji">
            <Input
                v-model="emoji"
                :label="trans('emoji')"
                @loaded="inp => inp.focus()"
                type="text"
                id="group-icon-emoji"
                placeholder=". . ."
                :error="errorMessage"
                :maxlength="10"
            />

            <Button type="submit" :disabled="preventSubmit" class="mt-3">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </form>
    </Popup>
</template>
