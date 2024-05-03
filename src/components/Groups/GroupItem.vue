<script setup lang="ts">
import type { Group } from '@/types'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
</script>

<template>
    <div class="group">
        <h2>{{ group.title }}</h2>
    </div>
</template>

<style lang="sass" scoped>
.group
    background: var(--transparent-blue)
    border-radius: 8px
    padding: 10px 14px

    h2
        font-size: .9em
        margin: 0
</style>