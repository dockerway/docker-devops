import PlatformPage from '../pages/crud/PlatformPage'
import ServicePage from '../pages/crud/ServicePage'
import EnvironmentPage from '../pages/crud/EnvironmentPage'
import EnvironmentServicePage from '../pages/crud/EnvironmentServicePage'
import StackPage from '../pages/crud/StackPage'
import DeployHistoryPage from '../pages/crud/DeployHistoryPage'

const routes = [
       
     {
        name: 'PlatformPage', 
        path: '/crud/platform', 
        component: PlatformPage,  
        meta: {
            requiresAuth: true,
            permission: "PLATFORM_SHOW"
        }
     },
   
     {
        name: 'ServicePage', 
        path: '/crud/service', 
        component: ServicePage,  
        meta: {
            requiresAuth: true,
            permission: "SERVICE_SHOW"
        }
     },
   
     {
        name: 'EnvironmentPage', 
        path: '/crud/environment', 
        component: EnvironmentPage,  
        meta: {
            requiresAuth: true,
            permission: "ENVIRONMENT_SHOW"
        }
     },
   
     {
        name: 'EnvironmentServicePage', 
        path: '/crud/environmentservice', 
        component: EnvironmentServicePage,  
        meta: {
            requiresAuth: true,
            permission: "ENVIRONMENTSERVICE_SHOW"
        }
     },
   
     {
        name: 'StackPage', 
        path: '/crud/stack', 
        component: StackPage,  
        meta: {
            requiresAuth: true,
            permission: "STACK_SHOW"
        }
     },
     {
        name: 'DeployHistoryPage', 
        path: '/crud/DeployHistory', 
        component: DeployHistoryPage,  
        meta: {
            requiresAuth: true,
            permission: "STACK_SHOW"
        }
     }
]

export default routes;
