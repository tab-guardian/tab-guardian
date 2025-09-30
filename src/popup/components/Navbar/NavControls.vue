<script setup lang="ts">
import Control from '@/components/Control.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import BellIcon from '@common/components/Icons/BellIcon.vue'
import { openSettingsPage } from '@/modules/openSettingsPage'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
</script>

<template>
    <div class="flex gap-2 items-center absolute right-2">
        <Control v-if="notificationStore.notification">
            <div class="rounded-full bg-orange-400 size-3 absolute top-0 right-0"></div>
            <BellIcon />
        </Control>

        <Control @click="openSettingsPage">
            <CogIcon />
        </Control>
    </div>
</template>
