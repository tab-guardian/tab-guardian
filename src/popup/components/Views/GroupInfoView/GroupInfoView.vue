<script setup lang="ts">
import type { Group } from '@/types'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import trans from '@common/modules/trans'
import View from '@/components/Views/View.vue'
import Message from '@common/components/Message.vue'
import ListItem from '@/components/Views/GroupInfoView/ListItem.vue'

const router = useRouter()
const store = useGroupStore()

const groupId = Number(router.currentRoute.value.params.id)
const { closeAllPopups } = usePopupStore()

onMounted(closeAllPopups)

const group = computed<Group | null>(() => store.getGroupById(groupId))
</script>

<template>
    <View
        class="select-tabs"
        :title="trans('group_details')"
        :subtitle="trans('you_can_find_details_here')"
    >
        <div v-if="group" class="pt-4 px-7">
            <ul class="space-y-1">
                <ListItem field="one" value="nice" />
            </ul>
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
