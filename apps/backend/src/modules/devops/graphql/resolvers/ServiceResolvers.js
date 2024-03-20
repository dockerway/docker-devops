import { createService, updateService, deleteService,  getAllServices, getServiceById, paginateServices, getServiceByName} from '../../services/ServiceService'
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

            return getServiceById(id)
        },
        findServiceByItsName: (_, {name}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return getServiceByName(name)
        },

        findServiceByItsNameAndStack:  (_, {name}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return findServiceByItsNameAndStack(name)
        },
        fetchService: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return getAllServices()
        },
        paginateService: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return paginateServices(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createService: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SERVICE_CREATE)) throw new ForbiddenError("Not Authorized")
            
            return createService(user, input)
        },
        updateService: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SERVICE_UPDATE)) throw new ForbiddenError("Not Authorized")
            
            return updateService(user, id, input)
        },
        deleteService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SERVICE_DELETE)) throw new ForbiddenError("Not Authorized")
            
            return deleteService(user, id)
        },
    }

}

