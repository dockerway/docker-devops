

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    ENVIRONMENTSERVICE_SHOW,

} from "../../permissions/EnvironmentService";

import {findDockerService, findDockerServiceTag} from "../../services/DockerService";

export default {
    Query: {
        findDockerServiceTag: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findDockerServiceTag(id)
        },
        findDockerService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findDockerService(id)
        },
    },
    Mutation: {

    }

}

