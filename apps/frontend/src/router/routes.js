import merge from 'deepmerge'
import baseRoutes from '../modules/base/routes'
import devopsRoutes from '../modules/devops/routes'
import registryRoutes from '../modules/registry/routes'

import {routes as userRoutes} from '@dracul/user-frontend'
import {routes as customRoutes} from '@dracul/customize-frontend'
import {routes as notificationRoutes} from '@dracul/notification-frontend'
import {routes as settingsRoutes} from '@dracul/settings-frontend'
import {routes as auditRoutes} from '@dracul/audit-frontend'

const routes = merge.all([baseRoutes, devopsRoutes, registryRoutes, userRoutes,
    notificationRoutes,
    customRoutes,
    settingsRoutes,
    auditRoutes
])


export default routes;
