<script setup lang="ts">
import type { PasswordBytes } from '@common/types'
import { trans } from '@common/modules'
import { ref, computed, onMounted } from 'vue'
import { passwordStorage } from '@common/modules/storage/password'
import { showToast } from '@common/modules/toast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const deleting = ref<boolean>(false)
const passwordBytes = ref<PasswordBytes[]>([])

const bytes = computed<number>(() => {
    return passwordBytes.value
        .map(pwd => pwd.bytes)
        .reduce((prev, curr) => prev + curr, 0)
})

onMounted(async () => await calculateBytes())

async function calculateBytes(): Promise<void> {
    passwordBytes.value = await passwordStorage.getBytes()
}

async function clearCache(): Promise<void> {
    if (passwordBytes.value.length === 0) {
        return
    }

    deleting.value = true

    for (const pwd of passwordBytes.value) {
        await passwordStorage.delete(pwd.groupId)
    }

    deleting.value = false

    showToast({
        text: trans('cache_cleared_on', bytes.value.toString()),
        type: 'info',
    })

    await calculateBytes()
}
</script>

<template>
    <Section
        v-if="bytes > 0"
        :title="trans('clear_cache')"
        :subtitle="trans('clear_cache_desc', bytes.toString())"
    >
        <Button @clicked="clearCache" :icon="TrashIcon" :loading="deleting">
            {{ trans('clear_cache') }}
        </Button>
    </Section>
</template>
