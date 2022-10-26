
import { createService, updateService, deleteService,  findService, fetchService, paginateService} from '../../services/ServiceService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    SERVICE_SHOW,
    SERVICE_UPDATE,
    SERVICE_CREATE,
    SERVICE_DELETE
} from "../../permissions/Service";

export default {
    Query: {
        findService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return findService(id)
        },
        fetchService: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return fetchService()
        },
        paginateService: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            return paginateService(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createService: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_CREATE)) throw new ForbiddenError("Not Authorized")
            return createService(user, input)
        },
        updateService: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_UPDATE)) throw new ForbiddenError("Not Authorized")
            return updateService(user, id, input)
        },
        deleteService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_DELETE)) throw new ForbiddenError("Not Authorized")
            return deleteService(user, id)
        },
    }

}

