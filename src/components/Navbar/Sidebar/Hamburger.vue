<script setup lang="ts">

</script>

<template>
    <div>
        <button
            type="button"
            class="hambuger"
        >
            <span></span>
            <span></span>
        </button>
    </div>
</template>

<style scoped lang="sass">
.hambuger
    width: 25px
    height: 20px
    background-color: transparent
    border: none
    cursor: pointer
    position: relative

    span
        width: 100%
        height: 3px
        display: block
        position: absolute
        background-color: var(--tg-color-bg-gray)
        transition: all .3s
        border-radius: 50px

    span:nth-child(1)
        top: 4px
        left: 0

    span:nth-child(2)
        bottom: 4px
        left: 0

    &.is-active
        width: 20px

        span:nth-child(1)
            top: 50%
            transform: translateY(-50%) rotate(45deg)

        span:nth-child(2)
            bottom: 50%
            transform: translateY(50%) rotate(-45deg)
</style>

