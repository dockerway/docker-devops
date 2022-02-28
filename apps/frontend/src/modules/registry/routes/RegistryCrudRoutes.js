import RegistryPage from '../pages/crud/RegistryPage'

const routes = [
       
     {
        name: 'RegistryPage', 
        path: '/crud/registry', 
        component: RegistryPage,  
        meta: {
            requiresAuth: true,
            permission: "REGISTRY_SHOW"
        }
     }
]

export default routes;
