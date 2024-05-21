<script setup lang="ts">
import { ref } from 'vue'
import { useTransStore } from '@settings/stores/trans'
import { useGroupStore } from '@/stores/group'
import { useSettingsStore } from '@/stores/settings'
import showToast from '@common/modules/showToast'
import Section from '@settings/components/Section.vue'
import Button from '@common/components/Form/Button.vue'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'

const { trans } = useTransStore()
const store = useSettingsStore()
const groupStore = useGroupStore()
const isConfirmed = ref<boolean>(false)

function saveSettings(): void {
    if (store.loading) {
        return
    }

    if (!isConfirmed.value) {
        showToast(
            trans('Confirm that you want to delete all non-private groups'),
            'error',
        )

        return
    }

    store.loading = true
    groupStore.deleteAllGroups()

    showToast(trans('All the non-private groups have been deleted'))

    isConfirmed.value = false
    store.loading = false
}
</script>

<template>
    <form @submit.prevent="saveSettings">
        <Section :title="trans('Erase all groups')">
            <div class="flex items-center justify-between gap-3">
                <SlideSwitch v-model="isConfirmed">
                    {{ trans('I confirm that I want to delete all groups') }}
                </SlideSwitch>

                <Button
                    additionalClasses="bg-red-600 dark:bg-red-400 min-w-[200px]"
                >
                    <TrashIcon class="w-5 h-5" />
                    {{ trans('Erase all groups') }}
                </Button>
            </div>
        </Section>
    </form>
</template>
