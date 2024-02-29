

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    NETWORKS_SHOW,
} from "../../permissions/Networks.js";

import {
    getDockerNetworks,
} from "../../services/NetworksService.js";

export default {
    Query: {
        getDockerNetworks: (_, { environment }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, NETWORKS_SHOW)) throw new ForbiddenError("Not Authorized")

            return getDockerNetworks(environment)
        },
    },
}

