import {
    NOTIFICATION_SHOW,
    NOTIFICATION_UPDATE,
    NOTIFICATION_CREATE,
} from "@dracul/notification-backend/lib/permissions"

import {
    AUDIT_SHOW,
} from "@dracul/audit-backend/lib/permissions/AuditPermissions"

import {
    CUSTOMIZATION_SHOW,
    CUSTOMIZATION_CREATE,
    CUSTOMIZATION_UPDATE,
    CUSTOMIZATION_COLORS_UPDATE,
    CUSTOMIZATION_LANG_UPDATE,
    CUSTOMIZATION_LOGO_UPDATE,
} from "@dracul/customize-backend/lib/permissions"

import {
    SETTINGS_SHOW,
    SETTINGS_UPDATE,
    SETTINGS_CREATE,
    SETTINGS_DELETE,
} from '@dracul/settings-backend/lib/permissions/Settings.js'

import {
    SECURITY_DASHBOARD_SHOW,
    SECURITY_ADMIN_MENU,
    SECURITY_GROUP_CREATE,
    SECURITY_GROUP_DELETE,
    SECURITY_GROUP_EDIT,
    SECURITY_GROUP_SHOW,
    SECURITY_ROLE_CREATE,
    SECURITY_ROLE_EDIT,
    SECURITY_ROLE_SHOW,
    SECURITY_ROLE_DELETE,
    SECURITY_USER_CREATE,
    SECURITY_USER_DELETE,
    SECURITY_USER_EDIT,
    SECURITY_USER_SHOW,
    SECURITY_ROLE_SHOW_CHILD
} from "@dracul/user-backend/lib/permissions/"

import {
    PLATFORM_MENU,
    PLATFORM_SHOW,
    PLATFORM_UPDATE,
    PLATFORM_CREATE,
    PLATFORM_DELETE,
} from '../../modules/devops/permissions/Platform'

import {
    BASE_SHOW,
} from '../../modules/base/permissions/'

import {
    STACK_MENU,
    STACK_SHOW,
    STACK_DELETE,
    STACK_CREATE,
    STACK_UPDATE
} from '../../modules/devops/permissions/Stack'

import {
    SERVICE_MENU,
    SERVICE_SHOW,
    SERVICE_CREATE,
    SERVICE_DELETE,
    SERVICE_UPDATE
} from '../../modules/devops/permissions/Service'

import {
    ENVIRONMENT_MENU,
    ENVIRONMENT_SHOW,
    ENVIRONMENT_UPDATE,
    ENVIRONMENT_CREATE,
    ENVIRONMENT_DELETE,
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
    REGISTRY_UPDATE,
    REGISTRY_CREATE,
    REGISTRY_DELETE
} from '../../modules/registry/permissions/Registry'

import {
    RESTORE_SYSTEM,
} from '../../modules/devops/permissions/Restore'

module.exports = {
    name: "Sudo",
    permissions: [
        RESTORE_SYSTEM,
        AUDIT_SHOW,
        BASE_SHOW,
        NOTIFICATION_SHOW,
        NOTIFICATION_UPDATE,
        NOTIFICATION_CREATE,
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
        PLATFORM_UPDATE,
        PLATFORM_CREATE,
        PLATFORM_DELETE,
        STACK_MENU,
        STACK_SHOW,
        STACK_DELETE,
        STACK_CREATE,
        STACK_UPDATE,
        SERVICE_MENU,
        SERVICE_SHOW,
        SERVICE_CREATE,
        SERVICE_DELETE,
        SERVICE_UPDATE,
        ENVIRONMENT_MENU,
        ENVIRONMENT_SHOW,
        ENVIRONMENT_UPDATE,
        ENVIRONMENT_CREATE,
        ENVIRONMENT_DELETE,
        ENVIRONMENTSERVICE_MENU,
        ENVIRONMENTSERVICE_SHOW,
        ENVIRONMENTSERVICE_CREATE,
        ENVIRONMENTSERVICE_UPDATE,
        ENVIRONMENTSERVICE_DELETE,
        REGISTRY_MENU,
        REGISTRY_SHOW,
        REGISTRY_UPDATE,
        REGISTRY_CREATE,
        REGISTRY_DELETE,
        SECURITY_DASHBOARD_SHOW,
        SECURITY_ADMIN_MENU,
        SECURITY_GROUP_CREATE,
        SECURITY_GROUP_DELETE,
        SECURITY_GROUP_EDIT,
        SECURITY_GROUP_SHOW,
        SECURITY_ROLE_CREATE,
        SECURITY_ROLE_EDIT,
        SECURITY_ROLE_SHOW,
        SECURITY_ROLE_DELETE,
        SECURITY_USER_CREATE,
        SECURITY_USER_DELETE,
        SECURITY_USER_EDIT,
        SECURITY_USER_SHOW,
        SECURITY_ROLE_SHOW_CHILD,
        CUSTOMIZATION_SHOW,
        CUSTOMIZATION_CREATE,
        CUSTOMIZATION_UPDATE,
        CUSTOMIZATION_COLORS_UPDATE,
        CUSTOMIZATION_LANG_UPDATE,
        CUSTOMIZATION_LOGO_UPDATE,
        SETTINGS_SHOW,
        SETTINGS_UPDATE,
        SETTINGS_CREATE,
        SETTINGS_DELETE,
    ],
    readonly: true
}