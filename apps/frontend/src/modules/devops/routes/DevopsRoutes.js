import SauronPage from "@/modules/devops/pages/SauronPage"
import DiscoveryPage from "@/modules/devops/pages/DiscoveryPage"

const routes = [

    {
        name: 'SauronPage',
        path: '/sauron',
        component: SauronPage,
        meta: {
            requiresAuth: true,
            //permission: "PLATFORM_SHOW"
        }
    },

    {
        name: 'DiscoveryPage',
        path: '/discovery',
        component: DiscoveryPage,
        meta: {
            requiresAuth: true,
            //permission: "PLATFORM_SHOW"
        }
    },

]

export default routes
