<script setup lang="ts">
import type { Group } from '@/types'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import moment from 'moment'
import trans from '@common/modules/trans'
import View from '@/components/Views/View.vue'
import Message from '@common/components/Message.vue'
import ListItem from '@/components/Views/GroupInfoView/ListItem.vue'

const router = useRouter()
const store = useGroupStore()

const groupId = Number(router.currentRoute.value.params.id)
const { closeAllPopups } = usePopupStore()

onMounted(closeAllPopups)

const DATE_FORMAT = 'DD.MM.YYYY HH:mm'
const group = computed<Group | null>(() => store.getGroupById(groupId))

const createdAt = computed<string>(() => {
    if (!group.value || !group.value.createdAt) {
        return '-'
    }

    return moment(group.value.createdAt).format(DATE_FORMAT)
})
</script>

<template>
    <View
        class="select-tabs"
        :title="trans('group_details')"
        :subtitle="trans('you_can_find_details_here')"
    >
        <div v-if="group" class="pt-3 px-3">
            <ul class="space-y-2">
                <ListItem :field="trans('group_name')" :value="group.name" />
                <ListItem
                    :field="trans('tabs_count')"
                    :value="group.links.length.toString()"
                />
                <ListItem
                    :field="trans('is_private')"
                    :value="group.isPrivate ? trans('yes') : trans('no')"
                />

                <ListItem
                    v-if="group.bindURL"
                    :field="trans('bound_to_url')"
                    :value="trans('yes')"
                />

                <ListItem :field="trans('created_at')" :value="createdAt" />

                <ListItem
                    :field="trans('updated_at')"
                    :value="moment(group.updatedAt).format(DATE_FORMAT)"
                />
            </ul>
        </div>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </View>
</template>
