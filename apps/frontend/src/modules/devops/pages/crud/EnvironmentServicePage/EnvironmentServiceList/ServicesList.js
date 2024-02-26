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
          const updatedServices = await Promise.all(
            services.map(async (service) => {
              const dockerService = (await DockerProvider.findDockerService(service.id)).data.findDockerService
              const updatedStatus = dockerService && dockerService.id ? activeMessage : inactiveMessage
      
              return { ...service, status: updatedStatus }
            })
          )
      
          return updatedServices
        } catch (error) {
          console.error(`An error happened at the setServicesStatus function: '${error}'`);
        }
      }
      
    
    

    async getServiceStatus(serviceId, activeMessage, inactiveMessage) {
        const service = (await DockerProvider.findDockerService(serviceId)).data.findDockerService
        return service && service.id ? activeMessage : inactiveMessage
    }
}

export default new ServicesList()