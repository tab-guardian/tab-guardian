<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { logger, trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { isImageUrl } from '@common/modules/url'
import { validateImageUrl } from '@common/modules/validation/url'
import Modal from '@/components/Modals/Modal.vue'
import Button from '@common/components/Form/Button.vue'
import Input from '@common/components/Form/Input.vue'
import CheckIcon from '@common/components/Icons/CheckIcon.vue'

const modalStore = useModalStore()
const groupStore = useGroupStore()

const url = ref<string>('')

const errorMessage = computed<string | null>(() => validateImageUrl(url.value))
const preventSubmit = computed<boolean>(() => validateImageUrl(url.value) !== null)

onMounted(setImageIcon)

function setImageIcon(): void {
    const group = groupStore.selectedGroup

    if (!group || !isImageUrl(group.icon)) {
        return
    }

    url.value = group.icon!
}

async function chooseImageIcon(): Promise<void> {
    if (preventSubmit.value) {
        return
    }

    if (!groupStore.selectedGroup) {
        logger().warn('No group selected for choosing image icon')
        return
    }

    hideImageIconModal()
}

function hideImageIconModal(): void {
    modalStore.hide('chooseImageIcon', {})
}
</script>

<template>
    <Modal
        v-if="groupStore.selectedGroup"
        @cancel="hideImageIconModal"
        :title="trans('enter_image_url')"
        :description="trans('type_any_image_url_to_set_it')"
    >
        <template #right-side>
            <img v-if="url" :src="url" width="30" />
        </template>

        <Input
            v-model="url"
            label="URL"
            @loaded="inp => inp.focus()"
            type="text"
            id="group-icon-emoji"
            placeholder="https://example.com/icon.png"
            :error="errorMessage"
        />

        <template #buttons>
            <Button @click="hideImageIconModal" is="outline">
                {{ trans('cancel') }}
            </Button>

            <Button is="success" @click="chooseImageIcon" :disabled="preventSubmit">
                <CheckIcon width="20" height="20" />
                {{ trans('select') }}
            </Button>
        </template>
    </Modal>
</template>
