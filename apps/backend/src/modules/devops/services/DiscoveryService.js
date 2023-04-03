import { fetchEnvironment, findEnvironment } from "./EnvironmentService";
import { fetchDockerService } from "./DockerService";
import { createService, findServiceByNameAndPlatform } from "./ServiceService";
import { createPlatform, findPlatformByName } from "./PlatformService";
import {
    createEnvironmentService,
    findEnvironmentServiceByEnvironmentStackService,

} from "./EnvironmentServiceService";
import { createStack, findStackByName, updateStack } from "./StackService";

/**
 * Start a discovery process to find Docker services running in one or multiple environments
 * @param {string} [environmentId] - ID of the environment to search in. If not specified, all environments will be searched.
 * @returns {Promise<Object>} A promise that resolves with an object containing the services discovered during the process.
 */

export const startDiscovery = async function (environmentId) {
    try {
        const envs = []
        const servicesDiscovered = []

        function addServiceDiscovered(sd) {
            let servicesDiscoveredIndex = servicesDiscovered.findIndex(i => i.name == sd.name && i.stack == sd.stack && i.environment == sd.environment)
            if (servicesDiscoveredIndex == -1) servicesDiscovered.push(sd)
        }

        (environmentId) ? envs.push(await findEnvironment(environmentId)) : envs = await fetchEnvironment()

        for (const env of envs) {
            const dockerServices = await fetchDockerService(env.id)
            console.log("dockerServices found", dockerServices.length)

            for (const dockerService of dockerServices) {
                let name

                if (dockerService.stack) {
                    name = dockerService.name.replace(dockerService.stack, "")
                } else if (dockerService.stack && name[0] === "_") {
                    name = name.substring(1)
                } else {
                    name = dockerService.name
                }

                const serviceDiscovered = {
                    name: name,
                    imageName: dockerService?.image?.name,
                    namespace: dockerService?.image?.namespace,
                    stack: dockerService?.stack,
                    environment: env.id,
                    image: dockerService?.image?.fullname,
                    dockerId: dockerService?.id
                }

                serviceDiscovered.keyName = env.name + "_" + serviceDiscovered.stack + "_" + serviceDiscovered.name

                const platform = await findPlatformByName(serviceDiscovered.namespace)
                if (!platform) {
                    console.log("PLATFORM NEW:", serviceDiscovered)
                    addServiceDiscovered(serviceDiscovered)
                } else {
                    const service = await findServiceByNameAndPlatform(serviceDiscovered.imageName, platform.id)
                    if (!service) {
                        console.log("SERVICE NEW:", serviceDiscovered)
                        addServiceDiscovered(serviceDiscovered)
                    } else {
                        const stack = await findStackByName(serviceDiscovered.stack)
                        if (!stack) {
                            console.log("STACK NEW:", serviceDiscovered)
                            addServiceDiscovered(serviceDiscovered)
                        } else {
                            const environmentService = await findEnvironmentServiceByEnvironmentStackService(
                                {
                                    environment: env.id,
                                    service: service.id,
                                    stack: stack.id,
                                }
                            )

                            if (!environmentService) {
                                console.log("ENVIRONMENT_SERVICE NEW:", serviceDiscovered)
                                addServiceDiscovered(serviceDiscovered)
                            }
                        }
                    }
                }
            }
        }

        return { servicesDiscovered }
    } catch (error) {
        throw error
    }
}


const getDockerService = async (service) => {
    const environmentDockerServices = {}

    try {
        const fillDockerService = async (envId) => {
            if (!environmentDockerServices.hasOwnProperty(envId)) environmentDockerServices[envId] = await fetchDockerService(envId)
            return environmentDockerServices
        }

        if (!environmentDockerServices.hasOwnProperty(service.environment)) await fillDockerService(service.environment)
        return environmentDockerServices[service.environment].find(i => i.id === service.dockerId)
    } catch (error) {
        throw new Error(`An error happened when we tried to getDockerService '${getDockerService}'`)
    }
}

async function findOrCreateServiceByNameAndPlatform(serviceDiscovered, platformId, user) {


    const dockerService = await getDockerService(serviceDiscovered)
    let service = await findServiceByNameAndPlatform(serviceDiscovered.imageName, platformId)

    if (!service) {
        let serviceEnvs = []
        let servicePorts = []
        let serviceVolumes = []
        let serviceFiles = []
        let serviceConstraints = []
        let serviceLimits = {}
        let servicePreferences = []
        const baseImage = serviceDiscovered.image.split(":")[0]

        if (dockerService) {
            serviceEnvs = dockerService.envs ? dockerService.envs.map(i => ({ name: i.name, defaultValue: '' })) : []
            servicePorts = dockerService.ports ? dockerService.ports.map(i => (i.containerPort)) : []
            serviceVolumes = dockerService.volumes ? dockerService.volumes.map(i => (i.containerVolume)) : []
            serviceFiles = dockerService.files ? dockerService.files.map(i => ({ fileName: i.fileName, fileContent: i.fileContent, containerPath: i.containerPath })) : []
            serviceConstraints = dockerService.constraints ? dockerService.constraints.map(i => ({ name: i.name, operation: i.operation, defaultValue: i.value })) : []
            serviceLimits = dockerService.limits ? dockerService.limits : {}
            servicePreferences = dockerService.preferences ? dockerService.preferences.map(i => ({ name: i.name, defaultValue: i.value })) : []
        }

        serviceLimits.memoryReservation = serviceLimits?.memoryReservation ? parseFloat(serviceLimits.memoryReservation / 1048576) : 0
        serviceLimits.memoryLimit = serviceLimits?.memoryLimit ? parseFloat(serviceLimits.memoryLimit / 1048576) : 0
        serviceLimits.CPUReservation = serviceLimits?.CPUReservation ? parseFloat(serviceLimits.CPUReservation / 1000000000) : 0
        serviceLimits.CPULimit = serviceLimits?.CPULimit ? parseFloat(serviceLimits.CPULimit / 1000000000) : 0

        service = await createService(user, {
            name: serviceDiscovered.imageName,
            platform: platformId,
            image: baseImage,
            envs: serviceEnvs,
            ports: servicePorts,
            volumes: serviceVolumes,
            files: serviceFiles,
            constraints: serviceConstraints,
            limits: serviceLimits,
            preferences: servicePreferences
        })
    }

    return service
}


export const createDiscovery = async function (servicesDiscovered, user) {
    try {
        const platformsCreated = []
        const servicesCreated = []
        const stacksCreated = []
        const environmentServicesCreated = []

        for (let serviceDiscovered of servicesDiscovered) {
            let platform = await findPlatformByName(serviceDiscovered.namespace)

            if (!platform) {
                console.log("PLATFORM NEW:", serviceDiscovered)
                platform = await createPlatform(user, { name: serviceDiscovered.namespace })
                platformsCreated.push(platform)
            }
            const service = await findOrCreateServiceByNameAndPlatform(serviceDiscovered, platform.id, user)
            servicesCreated.push(service)

            if (!serviceDiscovered.stack) serviceDiscovered.stack = "-"
            let stack = await findStackByName(serviceDiscovered.stack)

            if (!stack) {
                console.log("STACK NEW:", serviceDiscovered)

                stack = await createStack(user,
                    {
                        name: serviceDiscovered.stack,
                        platform: platform.id,
                        environments: [serviceDiscovered.environment]
                    }
                )

                stacksCreated.push(stack)
            } else {
                if (!stack.environments.some(e => e.id === serviceDiscovered.environment)) {
                    stack.environments.push(serviceDiscovered.environment)
                    await stack.save()
                }
            }

            const environmentServiceObject = {
                name: serviceDiscovered.name,
                environment: serviceDiscovered.environment,
                service: service.id,
                stack: stack.id,
                image: serviceDiscovered.image
            }

            let environmentService = await findEnvironmentServiceByEnvironmentStackService(environmentServiceObject)
            const dockerService = await getDockerService(serviceDiscovered)

            if (!environmentService) {
                Object.assign(environmentServiceObject, {
                    envs: dockerService?.envs || [],
                    ports: dockerService?.ports || [],
                    volumes: dockerService?.volumes || [],
                    files: dockerService?.files || [],
                    labels: dockerService?.labels || [],
                    constraints: dockerService?.constraints || [],
                    limits: dockerService?.limits || {},
                    preferences: dockerService?.preferences || [],
                })

                environmentService = await createEnvironmentService(user, environmentServiceObject)
                environmentServicesCreated.push(environmentService)
            }
        }

        return {
            platformsCreated,
            servicesCreated,
            stacksCreated,
            environmentServicesCreated
        }
        
    } catch (error) {
        throw error
    }
}
