import { createServiceTemplate, updateServiceTemplate, deleteServiceTemplate,  getAllServiceTemplates, getServiceTemplateById, paginateServiceTemplates} from '../../services/ServiceTemplateService'
import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {

    SERVICE_TEMPLATE_SHOW,
    SERVICE_TEMPLATE_UPDATE,
    SERVICE_TEMPLATE_CREATE,
    SERVICE_TEMPLATE_DELETE
} from "../../permissions/ServiceTemplate";

export default {
    Query: {
        findServiceTemplate: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_TEMPLATE_SHOW)) throw new ForbiddenError("Not Authorized")

            return getServiceTemplateById(id)
        },
        fetchServiceTemplate: (_, {}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_TEMPLATE_SHOW)) throw new ForbiddenError("Not Authorized")

            return getAllServiceTemplates()
        },
        paginateServiceTemplate: (_, {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, SERVICE_TEMPLATE_SHOW)) throw new ForbiddenError("Not Authorized")

            return paginateServiceTemplates(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc)
        },
        
    },
    Mutation: {
        createServiceTemplate: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SERVICE_TEMPLATE_CREATE)) throw new ForbiddenError("Not Authorized")
            
            return createServiceTemplate(user, input)
        },
        updateServiceTemplate: (_, {id, input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SERVICE_TEMPLATE_UPDATE)) throw new ForbiddenError("Not Authorized")
            
            return updateServiceTemplate(user, id, input)
        },
        deleteServiceTemplate: (_, {id}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if (!rbac.isAllowed(user.id, SERVICE_TEMPLATE_DELETE)) throw new ForbiddenError("Not Authorized")
            
            return deleteServiceTemplate(user, id)
        },
    }

}

