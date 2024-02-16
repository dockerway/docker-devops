import SauronPage from "@/modules/devops/pages/SauronPage"
import DiscoveryPage from "@/modules/devops/pages/DiscoveryPage"
import RemoveAllPage from "@/modules/devops/pages/RestoreSystemPage/RestoreSystemPage";

const routes = [

    {
        name: 'SauronPage',
        path: '/sauron',
        component: SauronPage,
        meta: {
            requiresAuth: true,
            permission: "PLATFORM_SHOW"
        }
    },

    {
        name: 'DiscoveryPage',
        path: '/discovery',
        component: DiscoveryPage,
        meta: {
            requiresAuth: true,
            permission: "PLATFORM_SHOW"
        }
    },

    {
        name: 'RemoveAllPage',
        path: '/restore-system',
        component: RemoveAllPage,
        meta: {
            requiresAuth: true,
            permission: "RESTORE_SYSTEM"
        }
    },

]

export default routes
