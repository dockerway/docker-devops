
import { createPlatform, updatePlatform, deletePlatform,  findPlatform, fetchPlatform, paginatePlatform} from '../../services/PlatformService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    PLATFORM_SHOW,
    PLATFORM_UPDATE,
    PLATFORM_CREATE,
    PLATFORM_DELETE
} from "../../permissions/Platform";

export default {
    Query: {
        findPlatform: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, PLATFORM_SHOW)) throw new ForbiddenError("Not Authorized")
            return findPlatform(id)
        },
        fetchPlatform: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, PLATFORM_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchPlatform()
        },
        paginatePlatform: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, PLATFORM_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginatePlatform(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createPlatform: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, PLATFORM_CREATE)) throw new ForbiddenError("Not Authorized")
            return createPlatform(user, input)
        },
        updatePlatform: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, PLATFORM_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updatePlatform(user, id, input)
        },
        deletePlatform: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, PLATFORM_DELETE)) throw new ForbiddenError("Not Authorized")
            return deletePlatform(id)
        },
    }

}

