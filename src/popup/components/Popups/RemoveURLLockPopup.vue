<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import NameInput from '@common/components/Form/NameInput.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const popupStore = usePopupStore()

const processing = ref<boolean>(false)

const formData = reactive({
    name: '',
    pass: '',
})

const errors = reactive({
    name: false,
    pass: false,
})

const preventSubmit = computed<boolean>(() => {
    return errors.pass || errors.name
})
</script>

<template>
    <Popup
        @cancel="popupStore.hide('removeURLLock', {})"
        :content="trans('enter_credentials')"
    >
        <div class="space-y-3">
            <NameInput
                v-model:name="formData.name"
                @loaded="inp => inp.focus()"
                @has-error="hasErr => (errors.name = hasErr)"
            />

            <PasswordInput
                v-model="formData.pass"
                id="enter-password"
                :label="trans('enter_pass')"
                :loading="processing"
                @has-error="hasErr => (errors.pass = hasErr)"
            />

            <div class="flex justify-end">
                <Button
                    type="submit"
                    :disabled="preventSubmit"
                    :icon="ChevronRightIcon"
                >
                    {{ trans('select') }}
                </Button>
            </div>
        </div>
    </Popup>
</template>
