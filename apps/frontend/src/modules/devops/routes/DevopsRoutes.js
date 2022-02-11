import SauronPage from "@/modules/devops/pages/SauronPage"

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

]

export default routes
