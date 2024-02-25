import EnvironmentServiceProvider from "../../../../providers/EnvironmentServiceProvider";
import DockerProvider from "../../../../providers/DockerProvider";

// import { string, object } from 'zod';

export class ServicesList {
    constructor(servicesProvider = EnvironmentServiceProvider) {
        this.servicesProvider = servicesProvider
    }

    async getPaginatedServices(pageNumber, itemsPerPage, search, filters, orderBy, orderDesc) {
        try {
            const paginatedServices = (await this.servicesProvider.paginateEnvironmentService(
                pageNumber, itemsPerPage, search, filters, orderBy, orderDesc
            )).data.paginateEnvironmentService

            return paginatedServices
        } catch (error) {
            console.error(`An error happened at the getPaginatedServices function: '${error}'`)
        }
    }

    async setInitialServicesStatus(services, initialStatusMessage) {
        try {
            for (let index = 0; index < services.length; index++) {
                services[index].status = initialStatusMessage
            }
        } catch (error) {
            console.error(`An error happened at the setInitialServicesStatus function: '${error}'`)
        }
    }

    async setServicesStatus(services, activeMessage, inactiveMessage) {
        try {
            console.log(`starting setServicesStatus`)
            for (let index = 0; index < services.length; index++) {
                const dockerService = (await DockerProvider.findDockerService(services[index].id)).data.findDockerService
                console.log(`setServicesStatus loop at index '${index}'`)

                if (dockerService && dockerService.id) {
                    services[index].status = activeMessage
                } else {
                    services[index].status = inactiveMessage
                }

                console.log(`services[index].status at index '${index}': '${services[index].status}'`)
            }

            return services
        } catch (error) {
            console.error(`An error happened at the setServicesStatus function: '${error}'`)
        }
    }

    async getServiceStatus(serviceId, activeMessage, inactiveMessage){
        const service = (await DockerProvider.findDockerService(serviceId)).data.findDockerService
        return service && service.id ? activeMessage : inactiveMessage
    }
}

export default new ServicesList()