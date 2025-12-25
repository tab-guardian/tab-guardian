<script setup lang="ts">
import { ref } from 'vue'
import { trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'

const modalStore = useModalStore()

const loading = ref<boolean>(false)

async function promptToDeleteUrlLock(): Promise<void> {
    if (loading.value) {
        return
    }

    loading.value = true
    await modalStore.show('removeUrlLock', {})
    loading.value = false
}
</script>

<template>
    <Section
        :title="trans('remove_url_lock')"
        :subtitle="trans('remove_url_lock_desc')"
    >
        <Button
            @clicked="promptToDeleteUrlLock"
            :icon="PencilSquareIcon"
            :disabled="loading"
        >
            {{ trans('enter_credentials') }}
        </Button>
    </Section>
</template>
