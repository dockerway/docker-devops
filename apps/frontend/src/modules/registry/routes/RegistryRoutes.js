import ImagesPage from "../pages/ImagesPage";

const routes = [
    {
        name: "ImagesPage",
        path: '/registry/images',
        component: ImagesPage,
        meta: {
            requiresAuth: true,
            permission: "REGISTRY_SHOW"
        }
    },
]

export default routes
