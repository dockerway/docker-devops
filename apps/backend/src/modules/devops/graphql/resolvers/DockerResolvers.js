

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    ENVIRONMENTSERVICE_CREATE,
    ENVIRONMENTSERVICE_SHOW,

} from "../../permissions/EnvironmentService";

import {
    createDockerService,
    findDockerService, findDockerServiceStats,
    findDockerServiceTag,
    updateDockerService
} from "../../services/DockerService";

export default {
    Query: {
        findDockerServiceTag: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findDockerServiceTag(id)
        },
        findDockerServiceStats: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findDockerServiceStats(id)
        },
        findDockerService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findDockerService(id)
        },
    },
    Mutation: {
        createDockerService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_CREATE)) throw new ForbiddenError("Not Authorized")
            return createDockerService(user, id)
        },
        updateDockerService: (_, {id, targetImage}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_CREATE)) throw new ForbiddenError("Not Authorized")
            return updateDockerService(id, targetImage, user)
        },
    }

}

