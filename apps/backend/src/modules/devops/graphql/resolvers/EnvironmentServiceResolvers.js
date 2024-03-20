
import {
    createEnvironmentService,
    updateEnvironmentService,
    deleteEnvironmentService,
    findEnvironmentService,
    fetchEnvironmentService,
    paginateEnvironmentService,
    deleteEnvironmentServicesByStack,
    deleteEnvironmentServicesByService,
    findEnvironmentServiceByItsName,
    findEnvironmentServiceByItsNameAndStack
} from '../../services/EnvironmentServiceService'

import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    ENVIRONMENTSERVICE_SHOW,
    ENVIRONMENTSERVICE_UPDATE,
    ENVIRONMENTSERVICE_CREATE,
    ENVIRONMENTSERVICE_DELETE
} from "../../permissions/EnvironmentService";

import { DefaultLogger as winston } from '@dracul/logger-backend'

export default {
    Query: {
        findEnvironmentService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return findEnvironmentService(id)
        },
        findEnvironmentServiceByItsName: (_, {name}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            const result = findEnvironmentServiceByItsName(name)
            return result
        },

        findEnvironmentServiceByItsNameAndStack: (_, {name, stack}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")
            
            const result = findEnvironmentServiceByItsNameAndStack(name, stack)
            return result
        },
        fetchEnvironmentService: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return fetchEnvironmentService()
        },
        paginateEnvironmentService: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_SHOW)) throw new ForbiddenError("Not Authorized")

            return paginateEnvironmentService(user, pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createEnvironmentService: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_CREATE)) throw new ForbiddenError("Not Authorized")

            return createEnvironmentService(user, input)
        },
        updateEnvironmentService: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_UPDATE)) throw new ForbiddenError("Not Authorized")

            return updateEnvironmentService(user, id, input)
        },
        deleteEnvironmentService: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_DELETE)) throw new ForbiddenError("Not Authorized")

            return deleteEnvironmentService(user, id)
        },

        deleteEnvironmentServicesByStack: (_, {stackID}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_DELETE)) throw new ForbiddenError("Not Authorized")

            return deleteEnvironmentServicesByStack(user, stackID)
        },
        deleteEnvironmentServicesByService: (_, {serviceID}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, ENVIRONMENTSERVICE_DELETE)) throw new ForbiddenError("Not Authorized")

            return deleteEnvironmentServicesByService(user, serviceID)
        },
    }

}

