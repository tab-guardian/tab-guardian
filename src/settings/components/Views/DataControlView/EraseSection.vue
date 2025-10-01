<script setup lang="ts">
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'
import { showToast } from '@common/modules/showToast'
import Swal from 'sweetalert2'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const store = useSettingsStore()
const groupStore = useGroupStore()

async function deleteGroups(): Promise<void> {
    if (store.loading) {
        return
    }

    const answer = await Swal.fire({
        title: trans('erase_all_groups'),
        text: trans('i_confirm_want_delete_groups'),
        showDenyButton: true,
        confirmButtonText: trans('yes'),
        denyButtonText: trans('no'),
    })

    if (!answer.isConfirmed) {
        return
    }

    store.loading = true
    await groupStore.deleteAllGroups()

    showToast(trans('all_groups_deleted'))

    store.loading = false
}
</script>

<template>
    <Section
        :title="trans('erase_all_groups')"
        :subtitle="trans('erase_all_groups_desc')"
    >
        <Button
            @clicked="deleteGroups"
            :icon="TrashIcon"
            class-name="bg-red-600 dark:bg-red-400"
        >
            {{ trans('erase_all_groups') }}
        </Button>
    </Section>
</template>
