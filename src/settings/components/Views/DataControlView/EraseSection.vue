<script setup lang="ts">
import { ref } from 'vue'
import { trans } from '@common/modules/utils'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import Swal from 'sweetalert2'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const groupStore = useGroupStore()

const loading = ref<boolean>(false)

async function deleteGroups(): Promise<void> {
    if (loading.value) {
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
            @clicked="deleteGroups"
            :icon="TrashIcon"
            :loading
            class-name="bg-red-600 dark:bg-red-400"
        >
            {{ trans('erase_all_groups') }}
        </Button>
    </Section>
</template>
