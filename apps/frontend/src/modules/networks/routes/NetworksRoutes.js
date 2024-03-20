import NetworksPage from "../pages/NetworksPage.vue"

const routes = [

    {
        name: 'NetworksPage',
        path: '/networks',
        component: NetworksPage,
        meta: {
            requiresAuth: true,
            permission: "PLATFORM_SHOW"
        }
    },

]

export default routes
