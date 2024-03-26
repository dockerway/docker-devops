/* ADD YOUR MODULE PERMISSIONS HERE */

import {
 BASE_SHOW
} from '../../modules/base/permissions'

import {
    PLATFORM_CREATE,
    PLATFORM_DELETE,
    PLATFORM_MENU,
    PLATFORM_SHOW,
    PLATFORM_UPDATE
} from '../../modules/devops/permissions/Platform'

import {
    STACK_CREATE,
    STACK_DELETE,
    STACK_MENU,
    STACK_SHOW,
    STACK_UPDATE
} from '../../modules/devops/permissions/Stack'

import {
    SERVICE_CREATE,
    SERVICE_DELETE,
    SERVICE_MENU,
    SERVICE_SHOW,
    SERVICE_UPDATE
} from '../../modules/devops/permissions/Service'


import {
    ENVIRONMENT_CREATE,
    ENVIRONMENT_DELETE,
    ENVIRONMENT_MENU,
    ENVIRONMENT_SHOW,
    ENVIRONMENT_UPDATE,
    DEV_VIEW,
    DEV_EDIT,
    DEV_ENV,
    DEV_DEPLOY,
    DEV_DELETE,
    QA_VIEW,
    QA_EDIT,
    QA_ENV,
    QA_DEPLOY,
    QA_DELETE,
    PRE_VIEW,
    PRE_EDIT,
    PRE_ENV,
    PRE_DEPLOY,
    PRE_DELETE,
    PROD_VIEW,
    PROD_EDIT,
    PROD_ENV,
    PROD_DEPLOY,
    PROD_DELETE,
} from '../../modules/devops/permissions/Environment'

import {
    ENVIRONMENTSERVICE_CREATE,
    ENVIRONMENTSERVICE_DELETE,
    ENVIRONMENTSERVICE_MENU,
    ENVIRONMENTSERVICE_SHOW,
    ENVIRONMENTSERVICE_UPDATE
} from '../../modules/devops/permissions/EnvironmentService'

import {
    RESTORE_SYSTEM
} from '../../modules/devops/permissions/Restore'

import {
    REGISTRY_CREATE,
    REGISTRY_DELETE,
    REGISTRY_MENU,
    REGISTRY_SHOW,
    REGISTRY_UPDATE
} from '../../modules/registry/permissions/Registry'

import {
    NODES_SHOW,
} from '../../modules/nodes/permissions/Nodes.js'
import { NETWORKS_SHOW } from '../../modules/networks/permissions/Networks.js'

export default [
    BASE_SHOW,
    PLATFORM_CREATE,
    PLATFORM_DELETE,
    PLATFORM_MENU,
    PLATFORM_SHOW,
    PLATFORM_UPDATE,
    SERVICE_CREATE,
    SERVICE_DELETE,
    SERVICE_MENU,
    SERVICE_SHOW,
    SERVICE_UPDATE,
    ENVIRONMENT_CREATE,
    ENVIRONMENT_DELETE,
    ENVIRONMENT_MENU,
    ENVIRONMENT_SHOW,
    ENVIRONMENT_UPDATE,
    ENVIRONMENTSERVICE_CREATE,
    ENVIRONMENTSERVICE_DELETE,
    ENVIRONMENTSERVICE_MENU,
    ENVIRONMENTSERVICE_SHOW,
    ENVIRONMENTSERVICE_UPDATE,
    STACK_CREATE,
    STACK_DELETE,
    STACK_MENU,
    STACK_SHOW,
    STACK_UPDATE,

    RESTORE_SYSTEM,

    REGISTRY_CREATE,
    REGISTRY_DELETE,
    REGISTRY_MENU,
    REGISTRY_SHOW,
    REGISTRY_UPDATE,

    DEV_VIEW,
    DEV_EDIT,
    DEV_ENV,
    DEV_DEPLOY,
    DEV_DELETE,
    QA_VIEW,
    QA_EDIT,
    QA_ENV,
    QA_DEPLOY,
    QA_DELETE,
    PRE_VIEW,
    PRE_EDIT,
    PRE_ENV,
    PRE_DEPLOY,
    PRE_DELETE,
    PROD_VIEW,
    PROD_EDIT,
    PROD_ENV,
    PROD_DEPLOY,
    PROD_DELETE,

    NODES_SHOW,
    NETWORKS_SHOW,
]
