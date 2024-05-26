<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { useTransStore } from '@/stores/trans'
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@common/components/Transitions/RightSlideTransition.vue'
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'
import UserCircleIcon from '@common/components/Icons/UserCircleIcon.vue'
import SidebarLink from '@/components/Navbar/Sidebar/SidebarLink.vue'

const sidebarStore = useSidebarStore()
const { trans } = useTransStore()
</script>

<template>
    <Hamburger />

    <Teleport to="body">
        <Overlay v-if="sidebarStore.isOpen" @click="sidebarStore.toggle()" />

        <RightSlideTransition>
            <aside
                v-if="sidebarStore.isOpen"
                class="z-30 absolute w-64 bg-secondary inset-y-0 left-0 shadow-md"
            >
                <SidebarLink
                    href="https://serhii.io/about-me"
                    :label="trans('Extension Author')"
                    :icon="UserCircleIcon"
                />
            </aside>
        </RightSlideTransition>
    </Teleport>
</template>
