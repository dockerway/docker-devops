import NodesPage from "../pages/NodesPage.vue"

const routes = [

    {
        name: 'NodesPage',
        path: '/nodes',
        component: NodesPage,
        meta: {
            requiresAuth: true,
            permission: "PLATFORM_SHOW"
        }
    },

]

export default routes
