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
const bindTip = ref<string>(
    'Bind this group to the (:n) URL. This will hide the group from everywhere else except this URL. It adds an extra layer of security',
)

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
    bindTip.value = `This feature doesn't work for this current URL`
}

function attachBindURL(checked: boolean): void {
    if (!checked) {
        store.newGroup.bindURL = null
        return
    }

    if (!currURL.value) {
        error.err('No current URL found')
        showToast(trans('Error occurred'), 'error')
        return
    }

    store.newGroup.bindURL = hashURL(currURL.value)
}
</script>

<template>
    <SlideSwitch
        v-tippy="currURL ? trans(bindTip, currURL) : trans(bindTip)"
        :disabled="!currURL"
        @changed="attachBindURL"
    >
        <div class="flex items-center gap-1">
            {{ trans('Bind to this URL') }}
        </div>
    </SlideSwitch>
</template>
