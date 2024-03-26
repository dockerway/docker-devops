

import { AuthenticationError, ForbiddenError } from "apollo-server-express";

import {
    NODES_SHOW,
} from "../../permissions/Nodes.js";

import {
    getAllNodes,
} from "../../services/NodesService.js";

export default {
    Query: {
        getDockerNodes: (_, { environment }, { user, rbac }) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, NODES_SHOW)) throw new ForbiddenError("Not Authorized")
            return getAllNodes(environment, user)
        },
    },
}

