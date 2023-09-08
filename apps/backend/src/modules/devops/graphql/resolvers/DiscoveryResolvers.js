

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    ENVIRONMENTSERVICE_SHOW,

} from "../../permissions/EnvironmentService";
import {createDiscovery, startDiscovery} from "../../services/DiscoveryService";


export default {
    Query: {
        startDiscovery: (_, {environmentId}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return startDiscovery(environmentId, user)
        },

    },
    Mutation: {
        createDiscovery: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return createDiscovery(input, user)
        },

    }

}

