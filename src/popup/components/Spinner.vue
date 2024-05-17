<template>
    <div class="text-center mt-5">
        <div class="inline-flex content-center items-center h-14 w-14">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="44"
                height="44"
                viewBox="0 0 44 44"
                class="animate-spin"
            >
                <circle
                    cx="22"
                    cy="22"
                    r="20"
                    fill="none"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-dasharray="31.41592653589793 31.41592653589793"
                    class="stroke-primary"
                ></circle>
            </svg>
        </div>
    </div>
</template>

<style scoped>
circle {
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}
</style>
