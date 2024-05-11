<script setup lang="ts">
import NavControls from '@/components/Navbar/NavControls.vue'
import Sidebar from '@/components/Navbar/Sidebar/Sidebar.vue'
import { usePopupStore } from '@/stores/usePopupStore'
import { useModalStore } from '@/stores/useModalStore'

const { closeAllPopups } = usePopupStore()
const { closeAllModals } = useModalStore()

function toMainScreen(): void {
    closeAllPopups()
    closeAllModals()
}
</script>

<template>
    <nav class="navbar">
        <Sidebar />
        <h1 @click="toMainScreen">Tab Guardian</h1>
        <NavControls />
    </nav>
</template>

<style lang="sass" scoped>
.navbar
    display: flex
    justify-content: space-between
    align-items: center
    height: 40px
    padding: 3px 10px
    background-color: var(--tg-color-bg)
    box-shadow: 0 0 4px 5px rgb(0 0 0 / 7%)

    h1
        font-size: .9rem
        cursor: pointer
        padding: 6px 4px
        transition: color .2s

        &:hover
            color: var(--tg-color-primary)
</style>
