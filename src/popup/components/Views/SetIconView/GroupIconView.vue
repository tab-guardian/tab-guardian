<script setup lang="ts">
import type { Group } from '@common/types'
import { onMounted, computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import { getIcons } from '@/modules/getIcons'
import { showToast } from '@common/modules/toast'
import IconItem from '@/components/Views/SetIconView/IconItem.vue'
import View from '@/components/Views/View.vue'
import Button from '@common/components/Form/Button.vue'
import FaceSmileIcon from '@common/components/Icons/FaceSmileIcon.vue'
import PhotoIcon from '@common/components/Icons/PhotoIcon.vue'

const groupStore = useGroupStore()
const router = useRouter()
const groupId = Number(router.currentRoute.value.params.id)

const modalStore = useModalStore()
const group = computed<Group | null>(() => groupStore.get(groupId))

const favIcons = computed<string[]>(() => {
    if (!group.value) {
        return []
    }

    const icons = group.value.links.map(link => link.favIconUrl)

    return Array.from(new Set(icons))
})

onMounted(modalStore.hideAll)

async function selectIcon(icon: string): Promise<void> {
    if (!group.value || icon === '' || group.value.icon === icon) {
        return
    }

    await groupStore.update(group.value.id, { icon })

    showToast({ text: trans('icon_is_set') })

    await router.push({ name: 'group', params: { id: group.value.id.toString() } })
}

async function openEmojiModal(): Promise<void> {
    const resp = await modalStore.show('chooseEmoji', {})
    const emo = resp?.emo

    if (emo) {
        await selectIcon(emo)
    }
}

async function openImageIconModal(): Promise<void> {
    const resp = await modalStore.show('chooseImageIcon', {})
    const url = resp?.url

    if (url) {
        await selectIcon(url)
    }
}
</script>

<template>
    <View :title="trans('choose_group_icon')">
        <div class="flex justify-center gap-2 mt-2">
            <Button is="outline" @click="openImageIconModal">
                <PhotoIcon class="size-5" /> {{ trans('select_image') }}
            </Button>

            <Button is="outline" @click="openEmojiModal">
                <FaceSmileIcon class="size-5" /> {{ trans('select_emoji') }}
            </Button>
        </div>

        <ul class="grid grid-cols-6 gap-2 mt-3">
            <IconItem
                v-for="icon in favIcons"
                :key="icon"
                @click="selectIcon(icon)"
                :selected="group!.icon === icon"
            >
                <img :src="icon" class="size-8" />
            </IconItem>

            <IconItem
                v-for="[name, icon] in Object.entries(getIcons())"
                :key="name"
                @click="selectIcon(name)"
                :selected="group!.icon === name"
            >
                <component :is="icon" class="size-8" />
            </IconItem>
        </ul>
    </View>
</template>
