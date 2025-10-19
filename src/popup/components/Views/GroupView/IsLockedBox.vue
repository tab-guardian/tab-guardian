<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupUnlock } from '@/composables/useGroupUnlock'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import Button from '@common/components/Form/Button.vue'

const props = defineProps<{ group: Group }>()
const popupStore = usePopupStore()
const { unlockGroup } = useGroupUnlock()

const encrypting = ref<boolean>(false)

async function promptEnterPassword(): Promise<void> {
    await popupStore.show('enterPassword', {
        decrypting: async pass => await unlockGroup(props.group, pass),
        text: trans('enter_pass_unlock_content'),
    })
}
</script>

<template>
    <WarningBox :message="trans('group_locked')" :success="true">
        <div class="w-52 flex flex-col items-end gap-1.5">
            <Button
                @click="promptEnterPassword"
                is="success"
                :icon="LockOpenIcon"
                :loading="encrypting"
            >
                {{ trans('unlock') }}
            </Button>
        </div>
    </WarningBox>
</template>
