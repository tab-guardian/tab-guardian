<script setup lang="ts">
import BackButton from '@/components/Modals/GroupModal/GroupControls/BackButton.vue'
import MenuButton from '@/components/Modals/GroupModal/GroupControls/MenuButton.vue'
</script>

<template>
    <div class="controls">
        <BackButton />

        <div class="controls__right">
            <MenuButton />
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
