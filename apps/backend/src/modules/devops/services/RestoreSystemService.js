import Platform from '../models/PlatformModel'
import Service from '../models/ServiceModel'
import Stack from '../models/StackModel'
import EnvironmentService from '../models/EnvironmentServiceModel'
import { createAudit } from '@dracul/audit-backend'

export const restoreSystem = function (authUser) {
    return new Promise(async (resolve, reject) => {
        try {

            await Platform.deleteMany({})
            await Service.deleteMany({})
            await Stack.deleteMany({})
            await EnvironmentService.deleteMany({})

            await createAudit(authUser, {user: authUser.id, action:'Restore system', resource: `All`})
            resolve("Registros eliminados")
        } catch (e) {
            reject(e)
        }

        }
    )
}
