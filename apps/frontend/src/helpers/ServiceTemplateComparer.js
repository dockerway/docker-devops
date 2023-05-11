/**
 * Creates a new instance of the `ServiceTemplateComparer` class.
 * @param {Object} template - The template to compare.
 * @param {Object} service - The service to compare.
 * @throws {Error} If the `template` or `service` parameters are not provided.
*/
export default class ServiceTemplateComparer {

    constructor(template, service) {

        if (!template || !service) throw new Error('The class must be instantiated with a template and a service')

        this.template = template
        this.service = service
    }

    /**
     * An array of fields to compare between the template and the service.
     * @type {Array<string>}
    */
    fieldsToCompare = ['volumes', 'files', 'ports', 'envs', 'constraints']

    /**
     * Converts the `template` object into a `templateToServiceFormat` object that has the `service` object format and only has the propertie values listed in `fieldsToCompare`.
     * @type {Object}
    */
    get templateToServiceFormat() {
        const templateToServiceFormat = {
            volumes: [],
            files: [],
            ports: [],
            envs: [],
            constraints: []
        }

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

    get serviceWithoutUselessInfo() {
        const serviceWithoutUselessInfo = {...this.service}

        Object.keys(serviceWithoutUselessInfo).forEach((property) => {
            if (!this.fieldsToCompare.includes(property)) {
                delete serviceWithoutUselessInfo[property]
            } else {
                switch (property) {
                    case "volumes":
                        serviceWithoutUselessInfo["volumes"].forEach(volume => delete volume["hostVolume"])
                        break;
                    case "files":
                        serviceWithoutUselessInfo["files"].forEach(file => {
                            delete file["hostPath"]
                            delete file["fileContent"]
                        })
                        break;
                    case "ports":
                        serviceWithoutUselessInfo["ports"].forEach(port => {
                            delete port["hostPort"]
                        })
                        break;
                    case "envs":
                        serviceWithoutUselessInfo["envs"].forEach(env => {
                            delete env["value"]
                        })
                        break;

                    case "constraints":
                        serviceWithoutUselessInfo["constraints"].forEach(constraint => {
                            delete constraint["value"]
                        })
                        break;

                    default:
                        break;
                }
            }
        })

        return serviceWithoutUselessInfo
    }


    /**
     * Determines whether the `service` object is different from the `template` object only taking into account the properties listed in `fieldsToCompare` 
     * @type {boolean}
    */
    get serviceIsDifferent() {
        let isDifferent = false

        this.fieldsToCompare.forEach(field => {
            const templateField = JSON.stringify(this.templateToServiceFormat[field])
            const serviceField = JSON.stringify(this.serviceWithoutUselessInfo[field])

            console.log(`templateField: '${templateField}' |  serviceField '${serviceField}'`)

            const templateSubset = templateField.startsWith('[') ? templateField.slice(1, -1) : templateField
            const serviceSubset = serviceField.startsWith('[') ? serviceField.slice(1, -1) : serviceField

            console.log(`templateSubset: '${templateSubset}' |  serviceSubset '${serviceSubset}'`)
            console.log(`serviceIncludesTemplate: '${serviceSubset.includes(templateSubset)}'`)

            if (!serviceSubset.includes(templateSubset)) isDifferent = true
        })

        return isDifferent
    }


}