import {
    NOTIFICATION_SHOW
} from "@dracul/notification-backend/lib/permissions"

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
    SERVICE_SHOW
} from '../../modules/devops/permissions/Service'

import {
    ENVIRONMENT_MENU,
    ENVIRONMENT_SHOW,
    QA_VIEW,
    QA_EDIT,
    QA_ENV,
    QA_DEPLOY,
    DEV_VIEW,
    PRE_VIEW,
    PROD_VIEW,
    QA_DELETE,
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
    name: "Direccion",
    permissions: [
        NOTIFICATION_SHOW,
        QA_VIEW,
        QA_EDIT,
        QA_ENV,
        QA_DEPLOY,
        QA_DELETE,
        DEV_VIEW,
        PRE_VIEW,
        PROD_VIEW,
        PLATFORM_MENU,
        PLATFORM_SHOW,
        STACK_MENU,
        STACK_SHOW,
        SERVICE_MENU,
        SERVICE_SHOW,
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