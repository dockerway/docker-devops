/**
 * Compares a service object against a service template object, and returns whether the service object
 * matches the service template object in the relevant fields.
*/
export default class ServiceTemplateComparer {

    /**
     * @param {object} template - The service template object to compare the service object against.
     * @param {object} service - The service object to compare against the service template object.
     * @throws {Error} Will throw an error if the class is not instantiated with both a template and a service.
    */
    constructor(template, service) {
      if (!template || !service) throw new Error('The class must be instantiated with a template and a service')
  
      this.template = template
      this.service = service
    }
  
    /**
     * An array of the names of the fields to compare between the service and template objects.
    */
    fieldsToCompare = ['volumes', 'files', 'ports', 'envs', 'constraints']
  

    /**
     * A getter that returns the service template object in a format that matches the format of the service object
     * (i.e., with irrelevant fields removed and remaining fields formatted to match the service object).
     * @returns {object} An object containing only the relevant fields from the service template object in a format
     * that matches the format of the service object.
    */

    get templateToServiceFormat() {
      const templateToServiceFormat = { volumes: [], files: [], ports: [], envs: [], constraints: []}
  
      this.template.volumes.forEach(templateVolume => {
        templateToServiceFormat.volumes.push({ containerVolume: templateVolume })
      })
  
      this.template.files.forEach(templateFile => {
        delete templateFile.hostPath
        delete templateFile.fileContent
  
        templateToServiceFormat.files.push({ ...templateFile })
      })
  
      this.template.ports.forEach(templatePort => {
        templateToServiceFormat.ports.push({ containerPort: templatePort })
      })
  
      this.template.envs.forEach(templateEnv => {
        delete templateEnv.defaultValue
  
        templateToServiceFormat.envs.push(templateEnv)
      })
  
      this.template.constraints.forEach(templateConstraint => {
        delete templateConstraint.defaultValue
  
        templateToServiceFormat.constraints.push(templateConstraint)
      })
  
      return templateToServiceFormat
    }
  

    /**
     * A getter that returns the service object with irrelevant fields removed.
     * @returns {object} An object containing only the relevant fields from the service object.
    */

    get serviceWithoutUselessInfo() {
      const serviceWithoutUselessInfo = { ...this.service }
  
      Object.keys(serviceWithoutUselessInfo).forEach((property) => {
        if (!this.fieldsToCompare.includes(property)) {
          delete serviceWithoutUselessInfo[property]
        } else {
          switch (property) {
            case "volumes":
              serviceWithoutUselessInfo["volumes"].forEach(volume => delete volume["hostVolume"])
              break
            case "files":
              serviceWithoutUselessInfo["files"].forEach(file => {
                delete file["hostPath"]
                delete file["fileContent"]
              })
              break
            case "ports":
              serviceWithoutUselessInfo["ports"].forEach(port => {
                delete port["hostPort"]
              })
              break
            case "envs":
              serviceWithoutUselessInfo["envs"].forEach(env => {
                delete env["value"]
              })
              break
  
            case "constraints":
              serviceWithoutUselessInfo["constraints"].forEach(constraint => {
                delete constraint["value"]
              })
              break
  
            default:
              break
          }
        }
      })
  
      return serviceWithoutUselessInfo
    }
  

    /**
     * A getter that returns whether the service object matches the service template object in the relevant fields.
     * @returns {boolean} `true` if the service object is different from the service template object in any of the
     * relevant fields; `false` otherwise.
    */

    get serviceIsDifferent() {
        const differences = []
        let isDifferent = false
      
        this.fieldsToCompare.forEach(field => {
          const templateFieldObjects = this.templateToServiceFormat[field]
          const serviceFieldObjects = this.serviceWithoutUselessInfo[field]
      
          const templateFieldCounts = {}
          templateFieldObjects.forEach(object => {
            const objectString = JSON.stringify(object)
            templateFieldCounts[objectString] = (templateFieldCounts[objectString] || 0) + 1
          })
      
          const serviceFieldCounts = {}
          serviceFieldObjects.forEach(object => {
            const objectString = JSON.stringify(object)
            serviceFieldCounts[objectString] = (serviceFieldCounts[objectString] || 0) + 1
          })
      
          const fieldIsDifferent = Object.keys(templateFieldCounts).some(key => {
            const templateCount = templateFieldCounts[key]
            const serviceCount = serviceFieldCounts[key]
      
            if (templateCount !== serviceCount) {
              differences.push({ field, object: JSON.parse(key) })
              return true
            }
      
            return false
          })
      
          if (fieldIsDifferent) {
            isDifferent = true
          }
        })
      
        console.log('Differences:', differences)
        return isDifferent
      }
      
      
  }
  