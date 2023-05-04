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
    SERVICE_TEMPLATE_MENU,
    SERVICE_TEMPLATE_SHOW
} from '../../modules/devops/permissions/ServiceTemplate'

import {
    ENVIRONMENT_MENU,
    ENVIRONMENT_SHOW,
    DEV_VIEW,
    DEV_EDIT,
    DEV_ENV,
    DEV_DEPLOY,
    QA_VIEW,
    QA_EDIT,
    QA_ENV,
    QA_DEPLOY,
    PRE_VIEW,
    PRE_EDIT,
    PRE_ENV,
    PRE_DEPLOY,
    PROD_VIEW,
    PROD_EDIT,
    PROD_ENV,
    PROD_DEPLOY
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

module.exports = {
    name: "Implementaciones",
    permissions: [
        NOTIFICATION_SHOW,
        DEV_VIEW,
        DEV_EDIT,
        DEV_ENV,
        DEV_DEPLOY,
        QA_VIEW,
        QA_EDIT,
        QA_ENV,
        QA_DEPLOY,
        PRE_VIEW,
        PRE_EDIT,
        PRE_ENV,
        PRE_DEPLOY,
        PROD_VIEW,
        PROD_EDIT,
        PROD_ENV,
        PROD_DEPLOY,
        PLATFORM_MENU,
        PLATFORM_SHOW,
        STACK_MENU,
        STACK_SHOW,
        SERVICE_TEMPLATE_MENU,
        SERVICE_TEMPLATE_SHOW,
        ENVIRONMENT_MENU,
        ENVIRONMENT_SHOW,
        ENVIRONMENTSERVICE_MENU,
        ENVIRONMENTSERVICE_SHOW,
        ENVIRONMENTSERVICE_CREATE,
        ENVIRONMENTSERVICE_UPDATE,
        ENVIRONMENTSERVICE_DELETE,
        REGISTRY_MENU,
        REGISTRY_SHOW
    ],
    readonly: true
}