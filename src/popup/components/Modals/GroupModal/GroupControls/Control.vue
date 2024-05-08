<template>
    <button type="button">
        <slot />
    </button>
</template>

<style lang="sass" scoped>
    button
        width: 35px
        height: 35px
        display: flex
        justify-content: center
        align-items: center
        background: transparent
        border: 1px solid var(--tg-color-text-default)
        color: var(--tg-color-text-default)
        border-radius: 5px
        padding: 5px
        opacity: .7
        transition: opacity .2s, box-shadow .2s
        cursor: pointer

        &:hover
            opacity: 1
            box-shadow: 0 0 5px rgba(0, 0, 0, .2)
</style>