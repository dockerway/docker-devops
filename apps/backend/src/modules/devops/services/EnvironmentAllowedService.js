import { RoleService } from '@dracul/user-backend'
import { DEV_VIEW, PRE_VIEW, PROD_VIEW, QA_VIEW } from '../permissions/Environment'
import { fetchEnvironmentByTypes } from './EnvironmentService'

export const environmentsAllowedView = async function (user) {
    const userRole = await RoleService.findRole(user.role.id)
    const envPermissions = [DEV_VIEW, QA_VIEW, PRE_VIEW, PROD_VIEW]
    const userEnvTypes = envPermissions.filter(envPermission => userRole.permissions.includes(envPermission))
    .map(userPermission => userPermission.split('_')[0])
    
    const envs = await fetchEnvironmentByTypes(userEnvTypes)

    return envs.map(env => env.id)
}

export const canUserDeploy = async function (user, envType) {
    const userRole = await RoleService.findRole(user.role.id)
    if (userRole.permissions.includes(`${envType}_DEPLOY`) ) {
        return true
    }
    return false
}
