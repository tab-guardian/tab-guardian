<script setup lang="ts">
import { ref } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import { getDefaultGroupName } from '@common/modules/group'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import NameInput from '@common/components/Form/NameInput.vue'

const popupStore = usePopupStore()
const groupStore = useGroupStore()

const name = ref<string>(groupStore.selectedGroup?.name || '')
const preventSubmit = ref<boolean>(false)

async function saveName(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    const group = groupStore.selectedGroup

    if (!group) {
        showToast({
            text: trans('error_no_group_selected'),
            type: 'error',
        })
        return
    }

    popupStore.hide('editGroupName', {})

    if (name.value === '') {
        name.value = getDefaultGroupName()
    }

    group.name = name.value

    await groupStore.save(group)

    showToast({ text: trans('new_name_saved') })
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('editGroupName', {})"
        :content="trans('enter_group_name')"
    >
        <form @submit.prevent="saveName" class="flex flex-col gap-3">
            <NameInput
                v-model:name="name"
                @loaded="inp => inp.focus()"
                @has-error="hasErr => (preventSubmit = hasErr)"
            />

            <Button
                type="submit"
                :disabled="preventSubmit"
                :icon="ChevronRightIcon"
            >
                {{ trans('save') }}
            </Button>
        </form>
    </Popup>
</template>
