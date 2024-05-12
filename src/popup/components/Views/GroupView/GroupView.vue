<script setup lang="ts">
import type { Group } from '@/types'
import { computed, watchEffect } from 'vue'
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { useRoute } from 'vue-router'
import View from '@/components/Views/View.vue'
import Links from '@/components/Views/GroupView/Links.vue'
import GroupTitle from '@/components/Views/GroupView/GroupTitle.vue'
import MenuButton from '@/components/Views/GroupView/GroupControls/MenuButton.vue'

const { trans } = useTransStore()
const { params } = useRoute()
const store = useGroupStore()

const group = computed<Group | null>(() => {
    const id = params.id

    if (!id) {
        return null
    }

    return store.getGroupById(Number(id))
})

watchEffect(() => {
    store.selectedGroup = group.value
})
</script>

<template>
    <View>
        <template #controls>
            <MenuButton />
        </template>

        <div v-if="group" class="group">
            <GroupTitle :group="group" />
            <Links :group="group" />
        </div>

        <div v-else class="message">
            <h2>
                😢
                {{ trans('Something went wrong! No group selected') }}
            </h2>
        </div>
    </View>
</template>
