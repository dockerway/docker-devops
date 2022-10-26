
import {AuthenticationError, ForbiddenError} from "apollo-server-express";

import {
    RESTORE_SYSTEM,
} from "../../permissions/Restore";
import {restoreSystem} from "../../services/RestoreSystemService";


export default {

    Mutation: {
        restoreSystem: (_, {input}, {user,rbac}) => {
            if (!user) throw new AuthenticationError("Unauthenticated")
            if(!rbac.isAllowed(user.id, RESTORE_SYSTEM)) throw new ForbiddenError("Not Authorized")
            return restoreSystem(user)
        },
    }

}

