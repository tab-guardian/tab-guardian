import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', () => {
    const max = ref<number>(0)
    const current = ref<number>(0)

    function reset(): void {
        max.value = 0
        current.value = 0
    }

    return {
        current,
        max,
        reset,
    }
})
