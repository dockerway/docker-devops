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
  PROD_VIEW
} from '../../modules/devops/permissions/Environment'

import {
  ENVIRONMENTSERVICE_MENU,
  ENVIRONMENTSERVICE_SHOW,
} from '../../modules/devops/permissions/EnvironmentService'

import {
  REGISTRY_MENU,
  REGISTRY_SHOW,
} from '../../modules/registry/permissions/Registry'

module.exports = {
    name: "Soporte",
    permissions: [
        NOTIFICATION_SHOW,
        PROD_VIEW,
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
        REGISTRY_MENU,
        REGISTRY_SHOW,
    ],
    readonly: true
}