import EnvironmentService from './../models/EnvironmentServiceModel'
import { UserInputError } from 'apollo-server-express'
import { canUserUpdate, environmentsAllowedView } from './EnvironmentAllowedService'
import { findEnvironment } from './EnvironmentService'
import { createAudit } from "@dracul/audit-backend"

export const findEnvironmentService = async function (id) {
    try {
        const envService = await EnvironmentService.findOne({ _id: id }).populate('environment').populate('service').populate('stack').exec()
        return envService
    } catch (error) {
        const message = error.message + ". " + (error.response.data ? error.response.data : '')
        throw message
    }
}

export const findEnvironmentServiceByEnvironmentStackService = async function ({ environment, stack, service }) {
    try {
        const envService = await EnvironmentService.findOne({
            environment: environment,
            stack: stack,
            service: service
        }).populate('environment').populate('service').populate('stack').exec()

        return envService
    } catch (error) {
        throw error
    }
}

export const fetchEnvironmentService = async function () {
    const envService = await EnvironmentService.find({}).populate('environment').populate('service').populate('stack').exec()
    return envService
}

export const paginateEnvironmentService = async function (user, pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    const envsAllowed = await environmentsAllowedView(user)

    function qs(search, filters, envsAllowed) {
        let qs = {}
        qs.environment = { $in: envsAllowed }

        if (search) {
            qs = {
                $or: [
                    { name: { $regex: search, $options: 'i' } }
                ]
            }
        }

        if (filters) {

            for (let filter of filters) {
                if (!filter.value) {
                    continue
                }

                switch (filter.operator) {
                    case '=':
                    case 'eq':
                        qs[filter.field] = { ...qs[filter.field], $eq: filter.value }
                        break;
                    case 'contain':
                    case 'regex':
                        qs[filter.field] = { ...qs[filter.field], $regex: filter.value }
                        break;
                    case '>':
                    case 'gt':
                        qs[filter.field] = { ...qs[filter.field], $gt: filter.value }
                        break;
                    case '<':
                    case 'lt':
                        qs[filter.field] = { ...qs[filter.field], $lt: filter.value }
                        break;
                    case '>=':
                    case 'gte':
                        qs[filter.field] = { ...qs[filter.field], $gte: filter.value }
                        break;
                    case '<=':
                    case 'lte':
                        qs[filter.field] = { ...qs[filter.field], $lte: filter.value }
                        break;
                    default:
                        qs[filter.field] = { ...qs[filter.field], $eq: filter.value }
                }
            }
        }
        return qs
    }

    function getSort(orderBy, orderDesc) {
        if (orderBy) {
            return (orderDesc ? '-' : '') + orderBy
        } else {
            return null
        }
    }

    let query = qs(search, filters, envsAllowed)


    let populate = ['environment', 'service', 'stack']
    let sort = getSort(orderBy, orderDesc)
    let params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    return new Promise((resolve, reject) => {
        EnvironmentService.paginate(query, params).then(result => {
            resolve({ items: result.docs, totalItems: result.totalDocs, page: result.page })
        }
        ).catch(err => reject(err))
    })
}


export const createEnvironmentService = async function (authUser, { environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences }) {
    const env = await findEnvironment(environment)

    if (! await canUserUpdate(authUser, env.type)) throw new Error("El usuario no tiene permiso para crear este entorno")

    const doc = new EnvironmentService({
        environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences
    })

    doc.id = doc._id

    try {
        await doc.save()
        await doc.populate('environment').populate('service').populate('stack').execPopulate()
        await createAudit(authUser, { user: authUser.id, action: 'Create environment service', resource: `${doc.name}` })

        return doc
    } catch (error) {
        if (error.name == "ValidationError") throw new UserInputError(error.message, { inputErrors: error.errors })
        throw error
    }
}

export const updateEnvironmentService = async function (authUser, id, { environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences }) {
    try {
        const environmentService = await findEnvironmentService(id)
        let envServiceOriginalName = environmentService.name

        const env = await findEnvironment(environment)
        const canUpdate = await canUserUpdate(authUser, env.type)

        if (!canUpdate) throw "El usuario no tiene permiso para editar este entorno"

        const updatedEnvService = await EnvironmentService.findOneAndUpdate(
            { _id: id },
            { environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences },
            { new: true, runValidators: true, context: 'query' }
        ).populate('environment').populate('service').populate('stack')

        const auditDescription = envServiceOriginalName !== name ? `Resource's new name is ${name}` : ''

        await createAudit(authUser, {
            user: authUser.id, action: 'Update environment service',
            resource: envServiceOriginalName,
            description: auditDescription
        })

        return updatedEnvService
    } catch (error) {
        if (error.name == "ValidationError") throw new UserInputError(error.message, { inputErrors: error.errors })
        throw error
    }
}

export const deleteEnvironmentService = async function (authUser, id) {
    const environmentService = await findEnvironmentService(id)
    if (!await canUserUpdate(authUser, environmentService.environment.type)) return reject("El usuario no tiene permiso para eliminar este entorno servicio")

    try {
        await environmentService.delete()
        await createAudit(authUser, { user: authUser.id, action: 'Delete environment service', resource: `${environmentService.name}` })

        return ({ id: id, success: true })
    } catch (error) {
        throw error
    }
}
