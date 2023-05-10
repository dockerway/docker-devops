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
    static fieldsToCompare = ['volumes', 'files', 'ports', 'envs', 'constraints']

    /**
     * Converts the `template` object into a `templateToServiceFormat` object that has the `service` object format and only has the propertie values listed in `fieldsToCompare`.
     * @type {Object}
    */
    get templateToServiceObject() {
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

    /**
     * Determines whether the `service` object is different from the `template` object only taking into account the properties listed in `fieldsToCompare` 
     * @type {boolean}
    */
    get serviceIsDifferent() {
        const templateToServiceObject = this.templateToServiceObject
        let isDifferent = false

        ServiceTemplateComparer.fieldsToCompare.forEach(field => {
            const templateField = JSON.stringify(templateToServiceObject[field])
            const serviceField = JSON.stringify(this.service[field])


            if (templateField !== serviceField) {
                console.log(`templateField: '${templateField}'`)
                console.log(`serviceField: '${serviceField}'`)
                isDifferent = true
            }
        })

        return isDifferent
    }


}