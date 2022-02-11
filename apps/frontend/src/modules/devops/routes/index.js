import merge from 'deepmerge'
import DevopsCrudRoutes from './DevopsCrudRoutes'
import DevopsRoutes from './DevopsRoutes'

const routes = merge.all([DevopsCrudRoutes,DevopsRoutes])


export default routes;

