<script setup lang="ts">
import type { Group } from '@/types'
import { onMounted, computed } from 'vue'
import { usePopupStore } from '@/stores/popup'
import { useTransStore } from '@/stores/trans'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import getIcons from '@/modules/getIcons'
import View from '@/components/Views/View.vue'
import IconItem from '@/components/Views/SetIconView/IconItem.vue'
import showToast from '@common/modules/showToast'

const store = useGroupStore()
const router = useRouter()
const { closeAllPopups } = usePopupStore()
const { trans } = useTransStore()
const groupId = Number(router.currentRoute.value.params.id)

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

    showToast(trans('Icon has been set'))

    router.push({ name: 'group', params: { id: group.value.id.toString() } })
}
</script>

<template>
    <View :title="trans('Choose a group icon')">
        <ul class="grid grid-cols-6 gap-2 mt-3">
            <IconItem
                v-for="[name, icon] in Object.entries(getIcons())"
                :key="name"
                @click="selectIcon(name)"
                :selected="group!.icon === name"
            >
                <component :is="icon" class="w-8 h-8" />
            </IconItem>

            <IconItem
                v-for="icon in favIcons"
                :key="icon"
                @click="selectIcon(icon)"
                :selected="group!.icon === icon"
            >
                <img :src="icon" class="w-8 h-8" />
            </IconItem>
        </ul>
    </View>
</template>
