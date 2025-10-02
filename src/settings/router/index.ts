import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from '@settings/router/routes'

export default createRouter({
    history: createMemoryHistory(),
    routes,
})
