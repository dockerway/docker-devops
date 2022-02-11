
import { createEnvironment, updateEnvironment, deleteEnvironment,  findEnvironment, fetchEnvironment, paginateEnvironment} from '../../services/EnvironmentService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    ENVIRONMENT_SHOW,
    ENVIRONMENT_UPDATE,
    ENVIRONMENT_CREATE,
    ENVIRONMENT_DELETE
} from "../../permissions/Environment";

export default {
    Query: {
        findEnvironment: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENT_SHOW)) throw new ForbiddenError("Not Authorized")
            return findEnvironment(id)
        },
        fetchEnvironment: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENT_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchEnvironment()
        },
        paginateEnvironment: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENT_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateEnvironment(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createEnvironment: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENT_CREATE)) throw new ForbiddenError("Not Authorized")
            return createEnvironment(user, input)
        },
        updateEnvironment: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENT_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateEnvironment(user, id, input)
        },
        deleteEnvironment: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, ENVIRONMENT_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteEnvironment(id)
        },
    }

}

