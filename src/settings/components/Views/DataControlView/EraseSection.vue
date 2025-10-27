<script setup lang="ts">
import { ref } from 'vue'
import { trans } from '@common/modules'
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

    const resp = await popupStore.show('confirm', {
        text: trans('i_confirm_want_delete_groups'),
    })

    if (resp && resp.isConfirmed) {
        await deleteGroups()
    }
}

async function deleteGroups(): Promise<void> {
    loading.value = true

    await groupStore.deleteAll()
    showToast({ text: trans('all_groups_deleted') })

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
            is="danger"
            :icon="TrashIcon"
            :loading
        >
            {{ trans('erase_all_groups') }}
        </Button>
    </Section>
</template>
