import ServiceTemplateComparer from "./ServiceTemplateComparer.js"
import { serviceTemplateObject, anotherServiceTemplateObject, serviceObject, anotherServiceObject } from './objects.js'

describe("serviceTemplateComparer class test suite", () => {

    test('serviceTemplateComparer throws an error if it isnt instantiated with two objects to compare', () => {
        try {
            const serviceTemplateComparer = new ServiceTemplateComparer()
        } catch (error) {
            expect(error.message).toBe('The class must be instantiated with a template and a service')
        }
    })

    test('map service template to service object with templateToServiceObject method', () => {
        const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplateObject, serviceObject)

        //irrelevant info to check due to requirements in ticket #80349
        delete serviceObject.environment
        delete serviceObject.id
        delete serviceObject.name
        delete serviceObject.service
        delete serviceObject.stack
        delete serviceObject.replicas
        delete serviceObject.image
        delete serviceObject.labels
        delete serviceObject.limits
        delete serviceObject.preferences
        delete serviceObject.command
        delete serviceObject.envs[0].value
        delete (serviceObject.ports[0]).hostPort
        delete (serviceObject.volumes[0]).hostVolume
        delete (serviceObject.constraints[0]).value
        delete (serviceObject.files[0]).fileContent
        delete (serviceObject.files[0]).hostPath

        const serviceObjectWithoutUselessInfo = serviceObject

        // console.info(`serviceTemplateComparer.templateToServiceObject: '${JSON.stringify(serviceTemplateComparer.templateToServiceObject, null, 2)}'`)
        // console.info(`serviceObject: '${JSON.stringify(serviceObjectWithoutUselessInfo, null, 2)}'`)

        expect(serviceTemplateComparer.templateToServiceObject).toEqual(serviceObjectWithoutUselessInfo)
    })

    test('serviceIsDifferent getter value is false if relevant properties (serviceTemplateComparer.fieldsToCompare) values match', () =>{
        const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplateObject, serviceObject)

        console.log(`serviceIsDifferent?: '${serviceTemplateComparer.serviceIsDifferent}'`)

        expect(serviceTemplateComparer.serviceIsDifferent).toBe(false)
    })

    test('serviceIsDifferent getter value is true if relevant properties (serviceTemplateComparer.fieldsToCompare) values do not match', () =>{
        const serviceTemplateComparer = new ServiceTemplateComparer(anotherServiceTemplateObject, serviceObject)

        console.log(`serviceIsDifferent?: '${serviceTemplateComparer.serviceIsDifferent}'`)

        expect(serviceTemplateComparer.serviceIsDifferent).toBe(true)
    })

    test('serviceIsDifferent getter value is true if relevant properties (serviceTemplateComparer.fieldsToCompare) values do not match (testing with different serviceObject)', () =>{
        const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplateObject, anotherServiceObject)

        console.log(`serviceIsDifferent?: '${serviceTemplateComparer.serviceIsDifferent}'`)
        
        expect(serviceTemplateComparer.serviceIsDifferent).toBe(true)
    })

})


