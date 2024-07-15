<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { useTransStore } from '@/stores/trans'
import getImageURL from '@common/modules/getImageURL'
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@common/components/Transitions/RightSlideTransition.vue'
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'
import UserCircleIcon from '@common/components/Icons/UserCircleIcon.vue'
import SidebarLink from '@/components/Navbar/Sidebar/SidebarLink.vue'
import Heading from '@/components/Navbar/Sidebar/Heading.vue'
import GitHubIcon from '@common/components/Icons/GitHubIcon.vue'
import DocumentIcon from '@common/components/Icons/DocumentIcon.vue'

const sidebarStore = useSidebarStore()
const { trans } = useTransStore()

const links = [
    {
        href: 'https://serhii.io/about-me',
        label: trans('Extension Author'),
        icon: UserCircleIcon,
    },
    {
        href: 'https://github.com/tab-guardian/tab-guardian',
        label: trans('Contribute'),
        icon: GitHubIcon,
    },
    {
        href: 'https://github.com/tab-guardian/tab-guardian/blob/main/CHANGELOG.md',
        label: trans('Release Notes'),
        icon: DocumentIcon,
    },
    // {
    //     href: rateUsLink,
    //     label: trans('Rate Us'),
    //     icon: StarIcon,
    // },
]
</script>

<template>
    <Hamburger />

    <Teleport to="body">
        <Overlay v-if="sidebarStore.isOpen" @click="sidebarStore.toggle()" />

        <RightSlideTransition>
            <aside
                v-if="sidebarStore.isOpen"
                :class="[
                    'z-30 absolute w-64 bg-secondary inset-y-0 left-0 shadow-md',
                    'flex flex-col justify-between',
                ]"
            >
                <div class="flex flex-col divide-y divide-border">
                    <Heading />

                    <SidebarLink
                        v-for="link in links"
                        :key="link.href"
                        :href="link.href"
                        :label="link.label"
                        :icon="link.icon"
                    />
                </div>

                <small
                    class="justify-end pr-2 mb-2 text-font-gray text-xs flex gap-2 w-full"
                >
                    <img :src="getImageURL('icons/icon-32.png')" class="w-4 h-4" />
                    Tab Guardian {{ __APP_VERSION__ }}
                </small>
            </aside>
        </RightSlideTransition>
    </Teleport>
</template>
