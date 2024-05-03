<script setup lang="ts">
import { ScreenName } from '@/types'
import MainScreen from '@/components/Screens/MainScreen.vue'
import GroupScreen from '@/components/Screens/GroupScreen.vue'
import { useScreenStore } from '@/stores/screenStore'

const screenStore = useScreenStore()
</script>

<template>
    <MainScreen v-if="screenStore.screen === ScreenName.Main" />
    <GroupScreen v-else-if="screenStore.screen === ScreenName.Group" />
</template>

<style lang="sass">
:root
    --dark-blue: #136881
    --dark-blue-hover: #18748f
    --transparent-blue: rgb(0 227 255 / 10%)
    --transparent-blue-hover: rgb(0 227 255 / 15%)

body
    background: #333
    color: #eee
    width: 330px
    font-family: 'Arial', sans-serif
</style>