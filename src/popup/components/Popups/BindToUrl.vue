<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { logger, trans } from '@common/modules'
import { useNewGroupStore } from '@/stores/newGroup'
import { getCurrentUrl, hashUrl } from '@common/modules/url'
import { showToast } from '@common/modules/toast'
import { validateUrl } from '@common/modules/validation/url'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import Input from '@common/components/Form/Input.vue'
import Tip from '@common/components/Tip.vue'

const emit = defineEmits<{
    (e: 'hasError', has: boolean): void
}>()

const newGroupStore = useNewGroupStore()

const currUrl = ref<string | null>(null)
const checked = ref<boolean>(false)

const urlError = computed<string | null>(() => {
    return validateUrl(currUrl.value)
})

const tooltip = computed<string>(() => {
    return currUrl.value ? trans('bind_group_url') : trans('cannot_bind_to_this_url')
})

onMounted(async () => {
    currUrl.value = await getCurrentUrl()
})

watchEffect(() => {
    emit('hasError', checked && urlError.value !== null)
})

async function attachBindUrl(checked: boolean): Promise<void> {
    if (!checked) {
        newGroupStore.choices.bindUrl = null
        return
    }

    if (!currUrl.value) {
        logger().error('No current URL found')
        showToast({ text: trans('cannot_bind_to_this_url'), type: 'error' })
        return
    }

    newGroupStore.choices.bindUrl = await hashUrl(currUrl.value)
}
</script>

<template>
    <div class="flex flex-col gap-3 mb-3">
        <div class="flex items-center">
            <SlideSwitch @changed="attachBindUrl" v-model="checked">
                {{ trans('bind_to_url') }}
            </SlideSwitch>

            <Tip :tip="tooltip" />
        </div>

        <Input
            v-if="checked"
            v-model="currUrl"
            id="bind-url"
            :error="urlError"
            type="text"
            placeholder="https://example.com"
            @loaded="inp => inp.focus()"
        />
    </div>
</template>
