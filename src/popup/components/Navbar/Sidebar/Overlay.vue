<script setup lang="ts">
import CloseIcon from '@common/components/Icons/CloseIcon.vue'
</script>

<template>
    <div class="overlay">
        <CloseIcon />
    </div>
</template>

<style scoped lang="sass">
.overlay
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgb(0 0 0 / 80%)
    cursor: pointer
    z-index: 1

    &:hover svg
        background-color: #f42323

    svg
        width: 32px
        height: 32px
        position: absolute
        right: 25px
        top: 10px
        color: white
        background-color: rgb(0 0 0 / 70%)
        border-radius: 50%
        padding: 5px
        transition: background-color .2s
</style>
