<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { trans } from '@common/modules'
import { useNewGroupStore } from '@/stores/newGroup'
import { getCurrentURL, hashURL } from '@common/modules/url'
import { showToast } from '@common/modules/toast'
import { validateURL } from '@common/modules/validation/url'
import SlideSwitch from '@common/components/Form/SlideSwitch.vue'
import Input from '@common/components/Form/Input.vue'
import Tip from '@common/components/Tip.vue'

const emit = defineEmits<{
    (e: 'hasError', has: boolean): void
}>()

onMounted(async () => {
    currURL.value = await getCurrentURL()
})

const newGroupStore = useNewGroupStore()

const currURL = ref<string | null>(null)
const checked = ref<boolean>(false)

const urlError = computed<string | null>(() => {
    return validateURL(currURL.value)
})

const tooltip = computed<string>(() => {
    return currURL.value ? trans('bind_group_url') : trans('cannot_bind_to_this_url')
})

watchEffect(() => {
    emit('hasError', urlError.value !== null)
})

async function attachBindURL(checked: boolean): Promise<void> {
    if (!checked) {
        newGroupStore.choices.bindUrl = null
        return
    }

    if (!currURL.value) {
        console.error('No current URL found')
        showToast({ text: trans('error_occurred'), type: 'error' })
        return
    }

    newGroupStore.choices.bindUrl = await hashURL(currURL.value)
}
</script>

<template>
    <div class="flex flex-col gap-3 mb-3">
        <div class="flex items-center">
            <SlideSwitch
                :disabled="!currURL"
                @changed="attachBindURL"
                v-model="checked"
            >
                {{ trans('bind_to_url') }}
            </SlideSwitch>

            <Tip :tip="tooltip" />
        </div>

        <Input
            v-if="checked"
            v-model="currURL"
            id="bind-url"
            :error="urlError"
            type="text"
            placeholder="https://example.com"
            @loaded="inp => inp.focus()"
        />
    </div>
</template>
