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
    <Section :title="trans('erase_all_groups')">
        <div class="flex items-center justify-between gap-3">
            <Button
                @clicked="deleteGroups"
                additionalClasses="bg-red-600 dark:bg-red-400"
            >
                <TrashIcon class="w-5 h-5" />
                {{ trans('erase_all_groups') }}
            </Button>
        </div>
    </Section>
</template>
