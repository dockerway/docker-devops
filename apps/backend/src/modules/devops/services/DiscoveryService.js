import {fetchEnvironment, findEnvironment} from "./EnvironmentService";
import {fetchDockerService} from "./DockerService";
import {createService, findServiceByNameAndPlatform} from "./ServiceService";
import {createPlatform, findPlatformByName} from "./PlatformService";
import {
    createEnvironmentService,
    findEnvironmentServiceByEnvironmentStackService,

} from "./EnvironmentServiceService";
import {createStack, findStackByName} from "./StackService";

export const startDiscovery = function (environmentId) {
    return new Promise(async (resolve, reject) => {
        try {

            let envs = []
            let envServices = []
            let servicesDiscovered = []

            function addServiceDisconvered(sd) {
                let index = servicesDiscovered.findIndex(i => i.name == sd.name && i.namespace == sd.namespace)
                if (index == -1) {
                    servicesDiscovered.push(sd)
                }
            }


            if (environmentId) {
                envs.push(await findEnvironment(environmentId))
            } else {
                envs = await fetchEnvironment()
            }


            for (let env of envs) {

                let dockerServices = await fetchDockerService(env.id)

                for (let dockerService of dockerServices) {

                    let serviceDiscovered = {
                        name: (dockerService.name.includes("_")) ? dockerService.name.split("_")[1] : dockerService.name,
                        imageName: dockerService?.image?.name,
                        namespace: dockerService?.image?.namespace,
                        stack: dockerService?.stack,
                        environment: environmentId,
                        image: dockerService?.image?.fullname
                    }

                    let platform = await findPlatformByName(serviceDiscovered.name)

                    if (!platform) {
                        addServiceDisconvered(serviceDiscovered)
                    } else {

                        let service = await findServiceByNameAndPlatform(serviceDiscovered.name, platform.id)

                        if (!service) {
                            addServiceDisconvered(serviceDiscovered)
                        }

                    }


                }


                //envServices.push(envService)
            }

            resolve({servicesDiscovered, envServices})
        } catch (e) {
            reject(e)
        }

    })
}


export const createDiscovery = function (servicesDiscovered) {
    return new Promise(async (resolve, reject) => {
        try {

            let platformsCreated = []
            let servicesCreated = []
            let stacksCreated = []
            let environmentServiceCreated = []

            for (let serviceDiscovered of servicesDiscovered) {

                let platform = await findPlatformByName(serviceDiscovered.namespace)

                if (!platform) {
                    platform = await createPlatform(null, {name: serviceDiscovered.namespace})
                    platformsCreated.push(platform)
                }

                let service = await findServiceByNameAndPlatform(serviceDiscovered.imageName, platform.id)

                if (!service) {
                    service = await createService(null, {
                        name: serviceDiscovered.imageName,
                        platform: platform.id
                    })

                    servicesCreated.push(service)
                }

                if(!serviceDiscovered.stack){
                    serviceDiscovered.stack = "-"
                }

                let stack = await findStackByName(serviceDiscovered.stack)

                if (!stack) {
                    stack = await createStack(null, {name: serviceDiscovered.stack})
                    stacksCreated.push(stack)
                }

                let environmentServiceObj = {
                    name: serviceDiscovered.name,
                    environment: serviceDiscovered.environment,
                    service: service.id,
                    stack: stack.id,
                    image: serviceDiscovered.image
                }

                let environmentService = await findEnvironmentServiceByEnvironmentStackService(environmentServiceObj)

                if(!environmentService){
                    environmentService = await createEnvironmentService(null, environmentServiceObj)
                    environmentServiceCreated.push(environmentService)
                }

            }

            let result = {
                platformsCreated,
                servicesCreated,
                stacksCreated,
                environmentServiceCreated

            }

            resolve(result)

        } catch (e) {
            reject(e)
        }

    })
}
