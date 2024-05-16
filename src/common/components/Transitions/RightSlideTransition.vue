<template>
    <Transition>
        <slot></slot>
    </Transition>
</template>

<style lang="sass" scoped>
.v-enter-active,
.v-leave-active
    transition: all .2s cubic-bezier(1, 0.5, 0.8, 1)
    position: absolute
    top: 0
    z-index: 1

.v-enter-from,
.v-leave-to
    transform: translateX(-100%)
</style>
