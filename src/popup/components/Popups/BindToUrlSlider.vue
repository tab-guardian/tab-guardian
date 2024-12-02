<script setup lang="ts">
import { ref, onMounted } from 'vue'
import trans from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import getCurrentURL from '@/modules/getCurrentURL'
import error from '@common/modules/error'
import showToast from '@common/modules/showToast'
import hashURL from '@/modules/hashURL'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'

const store = useGroupStore()

const currURL = ref<string | null>(null)
const bindTip = ref<string>(trans('bind_group_url', currURL.value || ''))

onMounted(async () => {
    await setBindTip()
})

async function setBindTip(): Promise<void> {
    const url = await getCurrentURL()

    if (url) {
        currURL.value = url
        return
    }

    currURL.value = null
    bindTip.value = trans('feature_does_not_work_this_url')
}

function attachBindURL(checked: boolean): void {
    if (!checked) {
        store.newGroup.bindURL = null
        return
    }

    if (!currURL.value) {
        error.err('No current URL found')
        showToast(trans('error_occurred'), 'error')
        return
    }

    store.newGroup.bindURL = hashURL(currURL.value)
}
</script>

<template>
    <SlideSwitch
        v-tippy="currURL ? bindTip : bindTip"
        :disabled="!currURL"
        @changed="attachBindURL"
    >
        <div class="flex items-center gap-1">
            {{ trans('bind_to_this_url') }}
        </div>
    </SlideSwitch>
</template>
