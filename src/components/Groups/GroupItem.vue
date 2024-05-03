<script setup lang="ts">
import type { Group } from '@/types'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import ShieldCheckIcon from '@/components/Icons/ShieldCheckIcon.vue';

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
</script>

<template>
    <div class="group">
        <div class="group__inner">
            <ShieldCheckIcon class="shield" v-if="group.isPrivate" />
            <div v-else class="amount">{{ group.links.length }}</div>

            <h2>{{ group.title }}</h2>
        </div>

        <div>
            <ChevronRightIcon class="icon-right" />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.group
    background: var(--transparent-blue)
    border-radius: 8px
    padding: 10px 14px
    display: flex
    justify-content: space-between
    align-items: center
    gap: 10px

    &__inner
        display: flex
        align-items: center
        gap: 12px

        .shield
            width: 25px
            height: 25px

    h2
        font-size: .9em
        margin: 0

    .amount
        width: 25px
        height: 25px
        background-color: rgba(0, 0, 0, .3)
        border-radius: 50%
        display: flex
        justify-content: center
        align-items: center
        font-size: 14px

    .icon-right
        width: 20px
        height: 20px
</style>