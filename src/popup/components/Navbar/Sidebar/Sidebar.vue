<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'
import { trans } from '@common/modules/trans'
import { openSettingsPage } from '@/modules/openSettingsPage'
import { isFirefox } from '@common/modules/browser/isFirefox'
import { getImageURL } from '@common/modules/browser/runtime'
import Hamburger from '@/components/Navbar/Sidebar/Hamburger.vue'
import RightSlideTransition from '@common/components/Transitions/RightSlideTransition.vue'
import Overlay from '@/components/Navbar/Sidebar/Overlay.vue'
import StarIcon from '@common/components/Icons/StarIcon.vue'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import SidebarLink from '@/components/Navbar/Sidebar/SidebarLink.vue'
import Heading from '@/components/Navbar/Sidebar/Heading.vue'
import GitHubIcon from '@common/components/Icons/GitHubIcon.vue'
import DocumentIcon from '@common/components/Icons/DocumentIcon.vue'

const sidebarStore = useSidebarStore()
const rateUsLink = isFirefox()
    ? 'https://addons.mozilla.org/firefox/addon/tab-guardian/'
    : 'https://chromewebstore.google.com/detail/tab-guardian/kjdklkfpliphcbnphmfhalllclfieojp'

const links = [
    {
        href: 'https://github.com/tab-guardian/tab-guardian',
        label: trans('contribute'),
        icon: GitHubIcon,
    },
    {
        href: 'https://github.com/tab-guardian/tab-guardian/blob/master/CHANGELOG.md',
        label: trans('release_notes'),
        icon: DocumentIcon,
    },
    {
        href: rateUsLink,
        label: trans('rate_us'),
        icon: StarIcon,
    },
    {
        href: 'javascript:',
        label: trans('settings'),
        icon: CogIcon,
        callback: openSettingsPage,
    },
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
                        @click="link.callback"
                    />
                </div>

                <small
                    class="justify-end pr-2 mb-2 text-font-gray text-xs flex gap-2 w-full"
                >
                    <img :src="getImageURL('icons/icon-32.png')" class="w-4 h-4" />
                    {{ trans('ext_name') }} {{ __APP_VERSION__ }}
                </small>
            </aside>
        </RightSlideTransition>
    </Teleport>
</template>
