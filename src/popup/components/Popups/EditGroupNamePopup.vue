<script setup lang="ts">
import { ref, computed } from 'vue'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import { isNameTooLong } from '@common/modules/validation/group'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import { getDefaultGroupName } from '@common/modules/utils/getDefaultGroupName'

const { closePopup } = usePopupStore()
const groupStore = useGroupStore()

const name = ref<string>(groupStore.selectedGroup?.name || '')

const tooLongName = computed<boolean>(() => isNameTooLong(name.value))

async function saveName(): Promise<void> {
    const group = groupStore.selectedGroup

    if (!group) {
        showToast(trans('error_no_group_selected'), 'error')
        return
    }

    if (tooLongName.value) {
        showToast(trans('group_name_long'), 'error')
        return
    }

    closePopup('editGroupName')

    if (name.value === '') {
        name.value = getDefaultGroupName()
    }

    group.name = name.value

    await groupStore.save(group)

    showToast(trans('new_name_saved'))
}
</script>

<template>
    <Popup
        @cancel="closePopup('editGroupName')"
        :content="trans('enter_group_name')"
    >
        <form @submit.prevent="saveName" class="flex flex-col gap-3">
            <NameInput v-model:name="name" @loaded="inp => inp.focus()" />

            <Button type="submit" :disabled="tooLongName" :icon="ChevronRightIcon">
                {{ trans('save') }}
            </Button>
        </form>
    </Popup>
</template>
