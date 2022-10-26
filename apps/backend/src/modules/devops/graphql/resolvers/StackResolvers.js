
import { createStack, updateStack, deleteStack,  findStack, fetchStack, paginateStack} from '../../services/StackService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    STACK_SHOW,
    STACK_UPDATE,
    STACK_CREATE,
    STACK_DELETE
} from "../../permissions/Stack";

export default {
    Query: {
        findStack: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, STACK_SHOW)) throw new ForbiddenError("Not Authorized")
            return findStack(id)
        },
        fetchStack: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, STACK_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchStack()
        },
        paginateStack: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, STACK_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateStack(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createStack: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, STACK_CREATE)) throw new ForbiddenError("Not Authorized")
            return createStack(user, input)
        },
        updateStack: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, STACK_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateStack(user, id, input)
        },
        deleteStack: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, STACK_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteStack(user, id)
        },
    }

}

