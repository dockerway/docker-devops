import {ApolloError} from "apollo-server-errors"

class ServiceNotFoundError extends ApolloError {
    constructor(message, properties) {
        super(message, 'SERVICE_NOT_FOUND_ERROR', properties)
        Object.defineProperty(this, 'name', {value: 'ServiceNotFoundError'})
    }
}

export default ServiceNotFoundError