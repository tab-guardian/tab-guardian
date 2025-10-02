<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trans } from '@common/modules/trans'
import { useNewGroupStore } from '@/stores/newGroup'
import { getCurrentURL } from '@/modules/getCurrentURL'
import { showToast } from '@common/modules/showToast'
import { hashURL } from '@/modules/url/hashURL'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const newGroupStore = useNewGroupStore()

const currURL = ref<string | null>(null)
const bindTip = ref<string>(trans('bind_group_url', 'unknown'))

onMounted(async () => {
    await setBindTip()
})

async function setBindTip(): Promise<void> {
    const url = await getCurrentURL()

    if (url) {
        currURL.value = url
        bindTip.value = trans('bind_group_url', url)
        return
    }

    currURL.value = null
    bindTip.value = trans('feature_does_not_work_this_url')
}

function attachBindURL(checked: boolean): void {
    if (!checked) {
        newGroupStore.choices.bindURL = null
        return
    }

    if (!currURL.value) {
        console.error('No current URL found')
        showToast(trans('error_occurred'), 'error')
        return
    }

    newGroupStore.choices.bindURL = hashURL(currURL.value)
}
</script>

<template>
    <SlideSwitch
        v-tippy="bindTip"
        :disabled="!currURL"
        @changed="attachBindURL"
    >
        <div class="flex items-center gap-1">
            {{ trans('bind_to_this_url') }}
        </div>
    </SlideSwitch>
</template>
