<script setup lang="ts">
import { ScreenName } from '@/types'
import { useScreenStore } from '@/stores/screenStore'
import { useTransStore } from '@/stores/transStore'
import BackButton from '@/components/Groups/BackButton.vue'

const screenStore = useScreenStore()
const { trans } = useTransStore()

function toMainScreen(): void {
    screenStore.selectedGroup = null
    screenStore.screen = ScreenName.Main
}
</script>

<template>
    <div class="group-screen">
        <BackButton @click="toMainScreen" />

        <div v-if="screenStore.selectedGroup">
            <h2>Group: {{ screenStore.selectedGroup.title }}</h2>
        </div>
        <div v-else class="no-group">
            <h2>{{ trans('Something went wrong! No group selected') }}</h2>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.group-screen
    padding: var(--tg-padding)

    .no-group
        font-size: .8rem
        padding: 10px
        text-align: center
</style>