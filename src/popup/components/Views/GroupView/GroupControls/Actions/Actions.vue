<script setup lang="ts">
import type { Group } from '@/types'
import OpenTabsAction from '@/components/Views/GroupView/GroupControls/Actions/OpenTabsAction.vue'
import OpenAndDeleteAction from '@/components/Views/GroupView/GroupControls/Actions/OpenAndDeleteAction.vue'
import StashAndCloseTabsAction from '@/components/Views/GroupView/GroupControls/Actions/StashAndCloseTabsAction.vue'
import StashTabsAction from '@/components/Views/GroupView/GroupControls/Actions/StashTabsAction.vue'

defineProps<{
    group: Group
}>()
</script>

<template>
    <div class="flex items-center gap-2">
        <StashAndCloseTabsAction :group />
        <StashTabsAction :group />
        <OpenTabsAction :group />
        <OpenAndDeleteAction :group />
    </div>
</template>
