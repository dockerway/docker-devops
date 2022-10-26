import EnvironmentService from './../models/EnvironmentServiceModel'
import {UserInputError} from 'apollo-server-express'
import { canUserUpdate, environmentsAllowedView } from './EnvironmentAllowedService'
import { findEnvironment } from './EnvironmentService'
import { createAudit } from "@dracul/audit-backend"

export const findEnvironmentService = async function (id) {
    return new Promise((resolve, reject) => {
        try {
            EnvironmentService.findOne({_id: id}).populate('environment').populate('service').populate('stack').exec((err, res) => (
                err ? reject(err) : resolve(res)
            ));
        } catch(err){
            let message = err.message + ". " + (err.response.data ? err.response.data : '')
            reject(message)
        }
    })
}

export const findEnvironmentServiceByEnvironmentStackService = async function ({environment, stack, service}) {
    return new Promise((resolve, reject) => {
        EnvironmentService.findOne({
            environment: environment,
            stack: stack,
            service: service
        }).populate('environment').populate('service').populate('stack').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchEnvironmentService = async function () {
    return new Promise((resolve, reject) => {
        EnvironmentService.find({}).populate('environment').populate('service').populate('stack').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateEnvironmentService = async function (user, pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    const envsAllowed = await environmentsAllowedView(user)

    function qs(search, filters, envsAllowed) {
        let qs = {}
        qs.environment = { $in: envsAllowed }

        if (search) {
            qs = {
                $or: [
                    {name: {$regex: search, $options: 'i'}}
                ]
            }
        }

        if (filters) {

                for(let filter of filters){
                    if(!filter.value){
                        continue
                    }

                    switch (filter.operator) {
                        case '=':
                        case 'eq':
                            qs[filter.field] = {...qs[filter.field], $eq: filter.value}
                            break;
                        case 'contain':
                        case 'regex':
                            qs[filter.field] = {...qs[filter.field], $regex: filter.value}
                            break;
                        case '>':
                        case 'gt':
                            qs[filter.field] = {...qs[filter.field], $gt: filter.value}
                            break;
                        case '<':
                        case 'lt':
                            qs[filter.field] = {...qs[filter.field], $lt: filter.value}
                            break;
                        case '>=':
                        case 'gte':
                            qs[filter.field] = {...qs[filter.field], $gte: filter.value}
                            break;
                        case '<=':
                        case 'lte':
                            qs[filter.field] = {...qs[filter.field], $lte: filter.value}
                            break;
                        default:
                            qs[filter.field] = {...qs[filter.field], $eq: filter.value}
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

    console.log("query", query)


    let populate = ['environment', 'service', 'stack']
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        EnvironmentService.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}


export const createEnvironmentService = async function (authUser, {environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences}) {
    let env = await findEnvironment(environment)
    if (! await canUserUpdate(authUser, env.type)) {
        return Promise.reject("El usuario no tiene permiso para crear este entorno")
    }
    const doc = new EnvironmentService({
        environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences
    })
    doc.id = doc._id;
    return new Promise((resolve, reject) => {
        doc.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return reject(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return reject(error)
            }

            doc.populate('environment').populate('service').populate('stack').execPopulate(async () => {
                await createAudit(authUser, {user: authUser.id, action:'Create environment service', resource: `${doc.name}`})
                resolve(doc)
            })
        }))
    })
}

export const updateEnvironmentService = async function (authUser, id, {environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences}) {
    return new Promise(async (resolve, reject) => {

        let envServiceOriginalName
        findEnvironmentService(id).then(({name}) => {
            envServiceOriginalName = name
        })

        let env = await findEnvironment(environment)
        if (! await canUserUpdate(authUser, env.type)) {
            return reject("El usuario no tiene permiso para editar este entorno")
        }
        EnvironmentService.findOneAndUpdate({_id: id},
            {environment, service, stack, image, name, replicas, labels, envs, ports, volumes, files, constraints, limits, preferences},
            {new: true, runValidators: true, context: 'query'},
            (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        return reject(new UserInputError(error.message, {inputErrors: error.errors}));

                    }
                    return reject(error)

                }

                doc.populate('environment').populate('service').populate('stack').execPopulate(async () => {
                    const auditDescription = envServiceOriginalName !== name ? `Resource's new name is ${name}` : ''
                    await createAudit(authUser, {user: authUser.id, action:'Update environment service',
                        resource: envServiceOriginalName,
                        description: auditDescription}
                    )
                    
                    resolve(doc)
                })
            })
    })
}

export const deleteEnvironmentService = function (authUser, id) {
    return new Promise(async (resolve, reject) => {
        let environmentService = await findEnvironmentService(id)
        if (! await canUserUpdate(authUser, environmentService.environment.type)) {
            return reject("El usuario no tiene permiso para eliminar este entorno servicio")
        }
        findEnvironmentService(id).then((doc) => {
            doc.delete(async function (err) {
                if (err) reject(err)
                
                await createAudit(authUser, {user: authUser.id, action:'Delete environment service', resource: `${environmentService.name}`})
                resolve({id: id, success: true})
            });
        })
    })
}
