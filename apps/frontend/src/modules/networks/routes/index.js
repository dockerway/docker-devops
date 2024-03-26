import merge from 'deepmerge'
import NetworksRoutes from './NetworksRoutes'

const routes = merge.all([NetworksRoutes])

export default routes;
