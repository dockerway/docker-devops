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
                let index = servicesDiscovered.findIndex(i => i.name == sd.name && i.stack == sd.stack && i.environment == sd.environment)
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

                console.log("dockerServices found",dockerServices.length)
                /*
                let summary = {}
                for(let dockerService of dockerServices){
                    if(summary[dockerService.stack]){
                        summary[dockerService.stack]++
                    }else{
                        summary[dockerService.stack] = 1
                    }
                }
                 console.log("dockerServices summary",summary)
                */



                for (let dockerService of dockerServices) {

                    let name
                    if(dockerService.name.includes("_")){
                        let nameSplited = dockerService.name.split("_")
                        name = nameSplited[nameSplited.length-1]
                    }else{
                        name = dockerService.name
                    }

                    let serviceDiscovered = {
                        name: name,
                        imageName: dockerService?.image?.name,
                        namespace: dockerService?.image?.namespace,
                        stack: dockerService?.stack,
                        environment: environmentId,
                        image: dockerService?.image?.fullname
                    }

                 /*   if(serviceDiscovered.stack != "multichanne_multic_prepro"){
                        continue
                    }*/


                    serviceDiscovered.keyName = env.name + "_" + serviceDiscovered.stack + "_"+serviceDiscovered.name

                    let platform = await findPlatformByName(serviceDiscovered.namespace)

                    if (!platform) {
                        console.log("PLATFORM NEW:",serviceDiscovered)
                        addServiceDisconvered(serviceDiscovered)
                    } else {

                        let service = await findServiceByNameAndPlatform(serviceDiscovered.imageName, platform.id)

                        if (!service) {
                            console.log("SERVICE NEW:",serviceDiscovered)
                            addServiceDisconvered(serviceDiscovered)
                        }else{
                            let stack = await findStackByName(serviceDiscovered.stack)

                            if (!stack) {
                                console.log("STACK NEW:",serviceDiscovered)
                                addServiceDisconvered(serviceDiscovered)
                            }else{

                                let environmentServiceObj = {
                                    environment: env.id,
                                    service: service.id,
                                    stack: stack.id,
                                }

                                let environmentService = await findEnvironmentServiceByEnvironmentStackService(environmentServiceObj)

                                if(!environmentService){
                                    console.log("ENVIRONMENT_SERVICE NEW:",serviceDiscovered)
                                    addServiceDisconvered(serviceDiscovered)
                                }
                            }
                        }

                    }


                }


                //envServices.push(envService)
            }

            //console.log("servicesDiscovered",servicesDiscovered)
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
                    console.log("PLATFORM NEW:",serviceDiscovered)
                    platform = await createPlatform(null, {name: serviceDiscovered.namespace})
                    platformsCreated.push(platform)
                }else{
                    console.log("PLATFORM OLD:",serviceDiscovered)
                }


                let service = await findServiceByNameAndPlatform(serviceDiscovered.imageName, platform.id)

                if (!service) {
                    console.log("SERVICE NEW:",platform, serviceDiscovered)
                    service = await createService(null, {
                        name: serviceDiscovered.imageName,
                        platform: platform.id
                    })

                    servicesCreated.push(service)
                }else{
                    console.log("SERVICE OLD:",platform, serviceDiscovered)
                }

                if(!serviceDiscovered.stack){
                    serviceDiscovered.stack = "-"
                }

                let stack = await findStackByName(serviceDiscovered.stack)

                if (!stack) {
                    console.log("STACK NEW:", serviceDiscovered)
                    stack = await createStack(null, {name: serviceDiscovered.stack})
                    stacksCreated.push(stack)
                }else{
                    console.log("STACK OLD:", serviceDiscovered)
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
                    console.log("ENV_SERVICE NEW:", serviceDiscovered, environmentService)
                    environmentService = await createEnvironmentService(null, environmentServiceObj)
                    environmentServiceCreated.push(environmentService)
                }else{
                    console.log("ENV_SERVICE OLD:", serviceDiscovered,environmentService)
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
