import MainView from '@/components/Views/MainView/MainView.vue'
import GroupView from '@/components/Views/GroupView/GroupView.vue'
import SelectTabsView from '@/components/Views/SelectTabsView/SelectTabsView.vue'
import GroupIconView from '@/components/Views/SetIconView/GroupIconView.vue'
import GroupDetailsView from '@/components/Views/GroupDetailsView/GroupDetailsView.vue'
import FolderView from '@/components/Views/FolderView/FolderView.vue'

export const routes = [
    { path: '/', name: 'main', component: MainView },
    { path: '/group/:id', name: 'group', component: GroupView },
    { path: '/folder/:id', name: 'folder', component: FolderView },
    { path: '/group-icon/:id', name: 'groupIcon', component: GroupIconView },
    {
        path: '/group-details/:id',
        name: 'groupDetails',
        component: GroupDetailsView,
    },
    {
        path: '/select-tabs/:operation?',
        name: 'select-tabs',
        component: SelectTabsView,
    },
]
