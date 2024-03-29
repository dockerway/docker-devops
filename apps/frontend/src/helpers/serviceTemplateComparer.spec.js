import { serviceTemplateObject, anotherServiceTemplateObject, serviceObject, anotherServiceObject, unorderedServiceTemplateObject, unorderedServiceObject } from './objects.js'
import ServiceTemplateComparer from "./ServiceTemplateComparer.js"

describe("serviceTemplateComparer class test suite", () => {

    // Relevant properties = serviceTemplateComparer.fieldsToCompare

    test('serviceTemplateComparer throws an error if it isnt instantiated with two objects to compare', () => {
        expect(() => new ServiceTemplateComparer()).toThrow('The class must be instantiated with a template and a service')
    })

    test('map service template to service object with templateToServiceFormat method', () => {
        expect((new ServiceTemplateComparer(serviceTemplateObject, serviceObject)).templateToServiceFormat)
    })

    test('serviceIsDifferent getter value is true if relevant properties values do not match', () => {
        expect((new ServiceTemplateComparer(anotherServiceTemplateObject, anotherServiceObject)).serviceIsDifferent).toBe(true)
        expect((new ServiceTemplateComparer(anotherServiceTemplateObject, serviceObject)).serviceIsDifferent).toBe(true)
        expect((new ServiceTemplateComparer(serviceTemplateObject, anotherServiceObject)).serviceIsDifferent).toBe(true)
    })

    test('serviceIsDifferent getter value is false if relevant properties values match', () => {
        expect((new ServiceTemplateComparer(serviceTemplateObject, serviceObject)).serviceIsDifferent).toBe(false)
    })

    test('serviceIsDifferent getter value is false if relevant properties values match but they are in different order', () => {
        expect((new ServiceTemplateComparer(unorderedServiceTemplateObject, unorderedServiceObject)).serviceIsDifferent).toBe(false)
    })

    test('If serviceIsDifferent getter value is true then the differences getter is not an empty array', () => {
        const serviceTemplateComparer = new ServiceTemplateComparer(anotherServiceTemplateObject, anotherServiceObject)
        if(serviceTemplateComparer.serviceIsDifferent) expect(serviceTemplateComparer.differences.length).toBeGreaterThan(0)
    })
    
    test('If serviceIsDifferent is true then the differencesText getter is not an empty string', () => {
        const serviceTemplateComparer = new ServiceTemplateComparer(anotherServiceTemplateObject, anotherServiceObject)
        if(serviceTemplateComparer.serviceIsDifferent) expect(serviceTemplateComparer.differencesText).not.toBe('')
        console.log(`serviceTemplateComparer.differencesText: '${serviceTemplateComparer.differencesText}'`)
    })

})






















