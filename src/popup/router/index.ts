import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '@/router/routes'

export default createRouter({
    history: createMemoryHistory(),
    routes,
})
