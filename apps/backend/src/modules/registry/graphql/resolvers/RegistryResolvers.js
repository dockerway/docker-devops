
import { createRegistry, updateRegistry, deleteRegistry,  findRegistry, fetchRegistry, paginateRegistry} from '../../services/RegistryService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    REGISTRY_SHOW,
    REGISTRY_UPDATE,
    REGISTRY_CREATE,
    REGISTRY_DELETE
} from "../../permissions/Registry";

export default {
    Query: {
        findRegistry: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, REGISTRY_SHOW)) throw new ForbiddenError("Not Authorized")
            return findRegistry(id)
        },
        fetchRegistry: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, REGISTRY_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchRegistry()
        },
        paginateRegistry: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, REGISTRY_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateRegistry(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createRegistry: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, REGISTRY_CREATE)) throw new ForbiddenError("Not Authorized")
            return createRegistry(user, input)
        },
        updateRegistry: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, REGISTRY_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateRegistry(user, id, input)
        },
        deleteRegistry: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, REGISTRY_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteRegistry(id)
        },
    }

}

