import DockerProvider from "../../../../providers/DockerProvider";

// import { string, object } from 'zod';

export class ServicesList {
    constructor(servicesProvider, activeStateMessage, inactiveStateMessage, unknownStateMessage) {
        this.servicesProvider = servicesProvider

        this.activeStateMessage = activeStateMessage
        this.inactiveStateMessage = inactiveStateMessage
        this.unknownStateMessage = unknownStateMessage
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

    async setServicesStatus(services) {
        try {
          const updatedServices = await Promise.all(
            services.map(async (service) => {
              const dockerServiceStatus = (await DockerProvider.findDockerServiceStatus(service.id)).data.findDockerServiceStatus
              let translatedStatus = null

              switch (dockerServiceStatus) {
                case 'active':
                    translatedStatus = this.activeStateMessage
                    break;
                case 'inactive':
                    translatedStatus = this.inactiveStateMessage
                    break;
                case 'unknown':
                    translatedStatus = this.unknownStateMessage
                    break;
              
                default:
                    break;
              }
      
              return { ...service, status: translatedStatus }
            })
          )
      
          return updatedServices
        } catch (error) {
          console.error(`An error happened at the setServicesStatus function: '${error}'`);
        }
      }
      
    
    

    async getServiceStatus(serviceId) {
        const dockerServiceStatus = (await DockerProvider.findDockerServiceStatus(serviceId)).data.findDockerServiceStatus
        let translatedStatus = null

        switch (dockerServiceStatus) {
          case 'active':
              translatedStatus = this.activeStateMessage
              break;
          case 'inactive':
              translatedStatus = this.inactiveStateMessage
              break;
          case 'timeout':
              translatedStatus = this.unknownStateMessage
              break;
        
          default:
              break;
        }

        return translatedStatus
    }
}
