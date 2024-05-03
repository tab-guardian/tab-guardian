<script setup lang="ts">
import { ScreenName } from '@/types'
import MainScreen from '@/components/Screens/MainScreen.vue'
import GroupScreen from '@/components/Screens/GroupScreen.vue'
import Navbar from '@/components/Navbar/Navbar.vue'
import { useScreenStore } from '@/stores/screenStore'

const screenStore = useScreenStore()
</script>

<template>
    <Navbar />
    <MainScreen v-if="screenStore.screen === ScreenName.Main" />
    <GroupScreen v-else-if="screenStore.screen === ScreenName.Group" />
</template>

<style lang="sass">
:root
    // dark theme
    // --tg-color-background-light: #2f3237
    // --tg-color-white: #111213
    // --tg-color-border-default: #2f3237
    // --tg-color-text-default: #f1f3f9
    // --tg-color-text-gray: #c2c9d6

    // white theme
    --tg-color-background-light: #f8f9fc
    --tg-color-white: #fff
    --tg-color-border-default: #dee3ed
    --tg-color-text-default: #2f3237
    --tg-color-text-gray: #8f96a3

    // Common
    --tg-color-primary: #427db3
    --tg-color-secondary: #377f7c

*, ::before, ::after
    box-sizing: border-box

html
    background: black

body
    margin: 0
    background: var(--tg-color-background-light)
    color: var(--tg-color-text-default)
    width: 330px
    min-height: 550px
    font-family: 'Arial', sans-serif
</style>