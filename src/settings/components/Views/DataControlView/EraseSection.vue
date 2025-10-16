<script setup lang="ts">
import type { ConfirmData } from '@common/types/popup'
import { ref } from 'vue'
import { trans } from '@common/modules/utils'
import { showToast } from '@common/modules/toast'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const groupStore = useGroupStore()
const popupStore = usePopupStore()

const loading = ref<boolean>(false)

async function promptToDeleteGroups(): Promise<void> {
    if (loading.value) {
        return
    }

    const confirmData: ConfirmData = {
        text: trans('i_confirm_want_delete_groups'),
    }

    popupStore.show('confirm', confirmData, async answer => {
        if (answer && answer.isConfirmed) {
            await deleteGroups()
        }
    })
}

async function deleteGroups(): Promise<void> {
    loading.value = true

    await groupStore.deleteAllGroups()
    showToast(trans('all_groups_deleted'))

    loading.value = false
}
</script>

<template>
    <Section
        :title="trans('erase_all_groups')"
        :subtitle="trans('erase_all_groups_desc')"
    >
        <Button
            @clicked="promptToDeleteGroups"
            :icon="TrashIcon"
            :loading
            class-name="bg-red-600 dark:bg-red-400"
        >
            {{ trans('erase_all_groups') }}
        </Button>
    </Section>
</template>
