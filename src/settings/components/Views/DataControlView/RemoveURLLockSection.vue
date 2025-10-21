<script setup lang="ts">
import { ref } from 'vue'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'

const groupStore = useGroupStore()
const popupStore = usePopupStore()

const loading = ref<boolean>(false)

async function promptToDeleteURLLock(): Promise<void> {
    if (loading.value) {
        return
    }

    const resp = await popupStore.show('removeURLLock', {})
}
</script>

<template>
    <Section
        :title="trans('remove_url_lock')"
        :subtitle="trans('remove_url_lock_desc')"
    >
        <Button
            @clicked="promptToDeleteURLLock"
            is="danger"
            :icon="PencilSquareIcon"
            :loading
        >
            {{ trans('enter_credentials') }}
        </Button>
    </Section>
</template>
