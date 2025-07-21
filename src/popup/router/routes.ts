import MainView from '@/components/Views/MainView/MainView.vue'
import GroupView from '@/components/Views/GroupView/GroupView.vue'
import SelectTabsView from '@/components/Views/SelectTabsView/SelectTabsView.vue'
import GroupIconView from '@/components/Views/SetIconView/GroupIconView.vue'
import GroupDetailsView from '@/components/Views/GroupDetailsView/GroupDetailsView.vue'

export const routes = [
    { path: '/', name: 'main', component: MainView },
    { path: '/group/:id/:openTabs?', name: 'group', component: GroupView },
    { path: '/group-icon/:id', name: 'groupIcon', component: GroupIconView },
    {
        path: '/group-details/:id',
        name: 'groupDetails',
        component: GroupDetailsView,
    },
    {
        path: '/select-tabs',
        name: 'select-tabs',
        component: SelectTabsView,
    },
]
