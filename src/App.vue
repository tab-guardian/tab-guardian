<script setup lang="ts">
import { ScreenName } from '@/types'
import MainScreen from '@/components/Screens/MainScreen/MainScreen.vue'
import GroupScreen from '@/components/Screens/GroupScreen/GroupScreen.vue'
import Navbar from '@/components/Navbar/Navbar.vue'
import { useScreenStore } from '@/stores/useScreenStore'

const screenStore = useScreenStore()
</script>

<template>
    <Navbar />
    <MainScreen v-if="screenStore.screen === ScreenName.Main" />
    <GroupScreen v-else-if="screenStore.screen === ScreenName.Group" />
</template>

<style lang="sass">
@import '@/assets/sass/main'
</style>