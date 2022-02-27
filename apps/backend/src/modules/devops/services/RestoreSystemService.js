import Platform from '../models/PlatformModel'
import Service from '../models/ServiceModel'
import Stack from '../models/StackModel'
import EnvironmentService from '../models/EnvironmentServiceModel'

export const restoreSystem = function () {
    return new Promise(async (resolve, reject) => {
        try {

            await Platform.deleteMany({})
            await Service.deleteMany({})
            await Stack.deleteMany({})
            await EnvironmentService.deleteMany({})

            resolve("Registros eliminados")
        } catch (e) {
            reject(e)
        }

        }
    )
}
