<script setup lang="ts">
import type { Group } from '@/types'
import { onMounted, computed } from 'vue'
import { usePopupStore } from '@/stores/popup'
import trans from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import getIcons from '@/modules/getIcons'
import showToast from '@common/modules/showToast'
import IconItem from '@/components/Views/SetIconView/IconItem.vue'
import View from '@/components/Views/View.vue'
import Btn from '@/components/Views/SetIconView/Btn.vue'
import FaceSmileIcon from '@common/components/Icons/FaceSmileIcon.vue'
import PhotoIcon from '@common/components/Icons/PhotoIcon.vue'

const store = useGroupStore()
const router = useRouter()
const groupId = Number(router.currentRoute.value.params.id)

const { closeAllPopups, openPopup } = usePopupStore()

const group = computed<Group | null>(() => store.getGroupById(groupId))

const favIcons = computed<string[]>(() => {
    if (!group.value) {
        return []
    }

    const icons = group.value.links.map(link => link.favIconUrl)

    return Array.from(new Set(icons))
})

onMounted(closeAllPopups)

async function selectIcon(icon: string): Promise<void> {
    if (!group.value) {
        return
    }

    await store.setIcon(group.value.id, icon)

    showToast(trans('icon_is_set'))

    router.push({ name: 'group', params: { id: group.value.id.toString() } })
}

function openEmojiPopup(): void {
    openPopup('chooseEmoji', (emo: string) => selectIcon(emo))
}

function openImageIconPopup(): void {
    openPopup('chooseImageIcon', (url: string) => selectIcon(url))
}
</script>

<template>
    <View :title="trans('choose_group_icon')">
        <div class="flex gap-2 mt-2">
            <Btn @click="openImageIconPopup">
                <PhotoIcon class="size-5" /> {{ trans('select_image') }}
            </Btn>

            <Btn @click="openEmojiPopup">
                <FaceSmileIcon class="size-5" /> {{ trans('select_emoji') }}
            </Btn>
        </div>

        <ul class="grid grid-cols-6 gap-2 mt-3">
            <IconItem
                v-for="icon in favIcons"
                :key="icon"
                @click="selectIcon(icon)"
                :selected="group!.icon === icon"
            >
                <img :src="icon" class="w-8 h-8" />
            </IconItem>

            <IconItem
                v-for="[name, icon] in Object.entries(getIcons())"
                :key="name"
                @click="selectIcon(name)"
                :selected="group!.icon === name"
            >
                <component :is="icon" class="w-8 h-8" />
            </IconItem>
        </ul>
    </View>
</template>
