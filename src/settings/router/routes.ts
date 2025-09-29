import GeneralView from '@settings/components/Views/GeneralView/GeneralView.vue'
import DataControlView from '@settings/components/Views/DataControlView/DataControlView.vue'

export const routes = [
    { path: '/', name: 'general', component: GeneralView },
    { path: '/data-control', name: 'data-control', component: DataControlView },
]
