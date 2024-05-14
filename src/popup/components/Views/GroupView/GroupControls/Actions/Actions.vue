<script setup lang="ts">
import OpenTabsAction from '@/components/Views/GroupView/GroupControls/Actions/OpenTabsAction.vue'
import OpenAndDeleteAction from '@/components/Views/GroupView/GroupControls/Actions/OpenAndDeleteAction.vue'
import StashAndCloseTabsAction from '@/components/Views/GroupView/GroupControls/Actions/StashAndCloseTabsAction.vue'
import StashTabsAction from '@/components/Views/GroupView/GroupControls/Actions/StashTabsAction.vue'
</script>

<template>
    <div class="actions">
        <StashAndCloseTabsAction />
        <StashTabsAction />
        <OpenTabsAction />
        <OpenAndDeleteAction />
    </div>
</template>

<style lang="sass" scoped>
.actions
    display: flex
    align-items: center
    gap: 8px
</style>
