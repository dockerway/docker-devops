

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    ENVIRONMENTSERVICE_SHOW,

} from "../../permissions/EnvironmentService";

import {findServiceTag} from "../../services/DockerService";

export default {
    Query: {
        findServiceTag: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findServiceTag(id)
        },

    },
    Mutation: {

    }

}

