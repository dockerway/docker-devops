import merge from 'deepmerge'
import NodesRoutes from './NodesRoutes'

const routes = merge.all([NodesRoutes])

export default routes;
