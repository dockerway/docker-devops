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

    test('map service template to service object with templateToServiceFormat method', () => {
        const serviceTemplateComparer = new ServiceTemplateComparer(serviceTemplateObject, serviceObject)

        // console.info(`serviceTemplateComparer.templateToServiceFormat: '${JSON.stringify(serviceTemplateComparer.templateToServiceFormat, null, 2)}'`)
        // console.info(`serviceObject: '${JSON.stringify(serviceObject, null, 2)}'`)
        // console.info(`serviceWithoutUselessInfo: '${JSON.stringify(serviceTemplateComparer.serviceWithoutUselessInfo, null, 2)}'`)
        
        expect(serviceTemplateComparer.templateToServiceFormat)
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

    test('serviceIsDifferent getter value is true if relevant properties (serviceTemplateComparer.fieldsToCompare) values do not match (testing with different serviceObject)', () =>{
        const serviceTemplateComparer = new ServiceTemplateComparer(anotherServiceTemplateObject, anotherServiceObject)

        console.log(`serviceIsDifferent?: '${serviceTemplateComparer.serviceIsDifferent}'`)
        
        expect(serviceTemplateComparer.serviceIsDifferent).toBe(true)
    })
})






















