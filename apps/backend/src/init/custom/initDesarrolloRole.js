import {
    NOTIFICATION_SHOW
} from "@dracul/notification-backend/lib/permissions";

import {
    PLATFORM_MENU,
    PLATFORM_SHOW
} from '../../modules/devops/permissions/Platform'

import {
    STACK_MENU,
    STACK_SHOW
} from '../../modules/devops/permissions/Stack'

import {
    SERVICE_MENU,
    SERVICE_SHOW,
    SERVICE_UPDATE,
    SERVICE_CREATE,
    SERVICE_DELETE,
} from '../../modules/devops/permissions/Service'

import {
    ENVIRONMENT_MENU,
    ENVIRONMENT_SHOW,
    DEV_VIEW,
    DEV_EDIT,
    DEV_ENV,
    DEV_DEPLOY,
    DEV_DELETE,
    QA_VIEW,
    PRE_VIEW, PRE_DELETE,
    PROD_VIEW
} from '../../modules/devops/permissions/Environment'

import {
    ENVIRONMENTSERVICE_MENU,
    ENVIRONMENTSERVICE_SHOW,
    ENVIRONMENTSERVICE_CREATE,
    ENVIRONMENTSERVICE_UPDATE,
    ENVIRONMENTSERVICE_DELETE
} from '../../modules/devops/permissions/EnvironmentService'

import {
    REGISTRY_MENU,
    REGISTRY_SHOW,
} from '../../modules/registry/permissions/Registry'

import {
    NETWORKS_SHOW,
} from '../../modules/networks/permissions/Networks'

import {
    NODES_SHOW,
} from '../../modules/nodes/permissions/Nodes'

module.exports = {
    name: "Desarrollo",
    permissions: [
        NOTIFICATION_SHOW,
        DEV_VIEW,
        DEV_EDIT,
        DEV_ENV,
        DEV_DEPLOY,
        DEV_DELETE,
        QA_VIEW,
        PRE_VIEW, PRE_DELETE,
        PROD_VIEW,
        PLATFORM_MENU,
        PLATFORM_SHOW,
        STACK_MENU,
        STACK_SHOW,
        SERVICE_MENU,
        SERVICE_SHOW,
        SERVICE_UPDATE,
        SERVICE_CREATE,
        SERVICE_DELETE,
        ENVIRONMENT_MENU,
        ENVIRONMENT_SHOW,
        ENVIRONMENTSERVICE_MENU,
        ENVIRONMENTSERVICE_SHOW,
        ENVIRONMENTSERVICE_CREATE,
        ENVIRONMENTSERVICE_UPDATE,
        ENVIRONMENTSERVICE_DELETE,
        REGISTRY_MENU,
        REGISTRY_SHOW,
        NETWORKS_SHOW,
        NODES_SHOW,
    ],
    readonly: true
}