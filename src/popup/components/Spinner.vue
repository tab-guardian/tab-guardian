<template>
    <div class="spinner--wrapper">
        <div class="spinner">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                class="spinner__svg"
            >
                <circle
                    cx="22"
                    cy="22"
                    r="20"
                    fill="none"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-dasharray="31.41592653589793 31.41592653589793"
                    class="spinner__circle"
                ></circle>
            </svg>
        </div>
    </div>
</template>

<style lang="sass" scoped>
.spinner
    display: inline-flex
    justify-content: center
    align-items: center
    height: 35px
    width: 35px

    &--wrapper
        text-align: center
        margin-top: 20px

    &__svg
        animation: rotate 1s linear infinite

    &__circle
        stroke: var(--tg-color-primary)
        animation: dash 1.5s ease-in-out infinite

@keyframes rotate
    100%
        transform: rotate(360deg)

@keyframes dash
    0%
        stroke-dasharray: 1, 200
        stroke-dashoffset: 0
    50%
        stroke-dasharray: 89, 200
        stroke-dashoffset: -35
    100%
        stroke-dasharray: 89, 200
        stroke-dashoffset: -124
</style>
