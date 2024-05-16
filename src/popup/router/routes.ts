import MainView from '@/components/Views/MainView/MainView.vue'
import GroupView from '@/components/Views/GroupView/GroupView.vue'
import SelectTabsView from '@/components/Views/SelectTabsView/SelectTabsView.vue'

export default [
    { path: '/', name: 'main', component: MainView },
    { path: '/group/:id', name: 'group', component: GroupView },
    {
        path: '/select-tabs',
        name: 'select-tabs',
        component: SelectTabsView,
    },
]
