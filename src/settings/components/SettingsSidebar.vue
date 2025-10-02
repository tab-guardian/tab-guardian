<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { Component } from 'vue'
import { trans } from '@common/modules/trans'
import CogIcon from '@common/components/Icons/CogIcon.vue'
import CircleStackIcon from '@common/components/Icons/CircleStackIcon.vue'

type SidebarLink = {
    title: string
    to: RouteLocationRaw
    icon: Component
}

const links: SidebarLink[] = [
    {
        title: trans('general'),
        to: { name: 'general' },
        icon: CogIcon,
    },
    {
        title: trans('data_control'),
        to: { name: 'data-control' },
        icon: CircleStackIcon,
    },
]
</script>

<template>
    <ul class="flex flex-col p-3 gap-1">
        <RouterLink
            v-for="link of links"
            :key="link.title"
            exact-active-class="bg-secondary-hover"
            class="p-2.5 border border-transparent hover:border-border rounded-xl flex gap-2 items-center"
            :to="link.to"
        >
            <component :is="link.icon" class="size-6" />
            {{ link.title }}
        </RouterLink>
    </ul>
</template>
