import merge from 'deepmerge'
import RegistryCrudRoutes from './RegistryCrudRoutes'
import RegistryRoutes from './RegistryRoutes'

const routes = merge.all([RegistryCrudRoutes,RegistryRoutes])


export default routes;

