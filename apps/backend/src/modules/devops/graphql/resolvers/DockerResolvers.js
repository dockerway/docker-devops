

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    ENVIRONMENTSERVICE_CREATE,
    ENVIRONMENTSERVICE_SHOW,

} from "../../permissions/EnvironmentService";

import {
    createDockerService,
    findDockerService, findDockerServiceStats,
    findDockerServiceTag,
    updateDockerService,
    deleteDockerService
} from "../../services/DockerService";
import { DEV_DELETE, PRE_DELETE, PROD_DELETE, QA_DELETE } from "../../permissions/Environment";

export default {
    Query: {
        findDockerServiceTag: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findDockerServiceTag(id)
        },
        findDockerServiceStats: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return findDockerServiceStats(id)
        },
        findDockerService: (_, { id }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return findDockerService(id)
        },
    },
    Mutation: {
        createDockerService: (_, { id, targetImage }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_CREATE)) throw new ForbiddenError("Not Authorized")

            return createDockerService(user, id, targetImage)
        },
        updateDockerService: (_, { id, targetImage }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_CREATE)) throw new ForbiddenError("Not Authorized")

            return updateDockerService(id, targetImage, user)
        },

        deleteDockerService: (_, { id, environment, name }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")

            const getServiceDeletePermissionByTheChosenEnvironment = () => {
                switch (environment) {
                    case 'DEV':
                        return DEV_DELETE
                    case 'QA':
                        return QA_DELETE
                    case 'PRE':
                        return PRE_DELETE
                    case 'PROD':
                        return PROD_DELETE
                    default:
                        break;
                }
            }

            const permissionNeeded = getServiceDeletePermissionByTheChosenEnvironment()
            if (!rbac.isAllowed(user.id, permissionNeeded)) throw new ForbiddenError("Not Authorized")

            return deleteDockerService(id, name, user)
        },
    }

}

