<script setup lang="ts">
import BackButton from '@/components/Modals/GroupModal/GroupControls/BackButton.vue'
import DeleteGroupButton from '@/components/Modals/GroupModal/GroupControls/DeleteGroupButton.vue'
import AddLinkButton from '@/components/Modals/GroupModal/GroupControls/AddLinkButton.vue'
</script>

<template>
    <div class="controls">
        <BackButton />

        <div class="controls__right">
            <AddLinkButton />
            <DeleteGroupButton />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.controls
    display: flex
    justify-content: space-between
    gap: 3px

    &__right
        display: flex
        gap: 3px
</style>
