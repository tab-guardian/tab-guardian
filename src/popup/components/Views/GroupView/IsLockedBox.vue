<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import Button from '@common/components/Form/Button.vue'

const props = defineProps<{ group: Group }>()
const { setSharedData, openPopup } = usePopupStore()

const encrypting = ref<boolean>(false)

function promptEnterPassword(): void {
    openPopup('enterPassword')
    setSharedData('enterPassword', props.group)
}
</script>

<template>
    <WarningBox :message="trans('group_locked')" :success="true">
        <div class="w-52 flex flex-col items-end gap-1.5">
            <Button
                :icon="LockOpenIcon"
                :loading="encrypting"
                @click="promptEnterPassword"
                class-name="bg-safe hover:bg-safe-hover text-white"
            >
                {{ trans('unlock') }}
            </Button>
        </div>
    </WarningBox>
</template>
