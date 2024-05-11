<template>
    <Transition>
        <slot />
    </Transition>
</template>

<style lang="sass" scoped>
.v-enter-active,
.v-leave-active
    transition: opacity .2s ease

.v-enter-from,
.v-leave-to
    opacity: 0

.v-enter-to,
.v-leave-from
    opacity: 1
</style>
