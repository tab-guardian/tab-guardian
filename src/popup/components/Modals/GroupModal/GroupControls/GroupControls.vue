<script setup lang="ts">
import BackButton from '@/components/Modals/GroupModal/GroupControls/BackButton.vue'
import DeleteGroupButton from '@/components/Modals/GroupModal/GroupControls/DeleteGroupButton.vue'
import AddLinkButton from '@/components/Modals/GroupModal/GroupControls/AddLinkButton.vue'
import RenameButton from '@/components/Modals/GroupModal/GroupControls/RenameButton.vue'
</script>

<template>
    <div class="controls">
        <BackButton />

        <div class="controls__right">
            <RenameButton />
            <AddLinkButton />
            <DeleteGroupButton />
        </div>
    </div>
</template>

<style lang="sass" scoped>
.controls
    display: flex
    justify-content: space-between
    gap: 2px

    &__right
        display: flex
</style>
