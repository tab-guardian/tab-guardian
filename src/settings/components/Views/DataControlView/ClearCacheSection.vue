<script setup lang="ts">
import { trans } from '@common/modules/trans'
import { ref, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { getPasswordsBytes } from '@common/modules/storage/password'
import { showToast } from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const groupStore = useGroupStore()

const deleting = ref<boolean>(false)
const bytes = ref<number>(0)

onMounted(async () => await calculateBytes())

async function calculateBytes(): Promise<void> {
    bytes.value = await getPasswordsBytes()
}

async function clearCache(): Promise<void> {
    if (bytes.value === 0) {
        return
    }

    deleting.value = true

    // TODO: clear storage
    bytes.value =  0

    deleting.value = false

    // showToast(trans('all_groups_deleted'))
}
</script>

<template>
    <Section
        v-if="bytes > 0"
        :title="trans('clear_cache')"
        :subtitle="trans('clear_cache_desc', bytes.toString())"
    >
        <Button
            @clicked="clearCache"
            :icon="TrashIcon"
            :loading="deleting"
        >
            {{ trans('clear_cache') }}
        </Button>
    </Section>
</template>
