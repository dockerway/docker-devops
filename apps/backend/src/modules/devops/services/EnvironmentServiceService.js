import EnvironmentService from './../models/EnvironmentServiceModel'
import {UserInputError} from 'apollo-server-express'

export const findEnvironmentService = async function (id) {
    return new Promise((resolve, reject) => {
        EnvironmentService.findOne({_id: id}).populate('environment').populate('service').populate('stack').exec((err, res) => (
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

export const paginateEnvironmentService = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    function qs(search, filters) {
        let qs = {}
        if (search) {
            qs = {
                $or: [

                ]
            }
        }

        if(filters){

            filters.forEach(filter => {
                switch(filter.operator){
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
            })

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

    let query = qs(search, filters)
    let populate = ['environment','service','stack']
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        EnvironmentService.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





export const createEnvironmentService = async function (authUser, {environment, service, stack, image, replicas, labels, envs, ports, volumes}) {

    const doc = new EnvironmentService({
        environment, service, stack, image, replicas, labels, envs, ports, volumes
    })
    doc.id = doc._id;
    return new Promise((resolve, rejects) => {
        doc.save((error => {

            if (error) {
                if (error.name == "ValidationError") {
                    return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return rejects(error)
            }

            doc.populate('environment').populate('service').populate('stack').execPopulate(() => resolve(doc))
        }))
    })
}

export const updateEnvironmentService = async function (authUser, id, {environment, service, stack, image, replicas, labels, envs, ports, volumes}) {
    return new Promise((resolve, rejects) => {
        EnvironmentService.findOneAndUpdate({_id: id},
        {environment, service, stack, image, replicas, labels, envs, ports, volumes},
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {

            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));

                }
                return rejects(error)

            }

            doc.populate('environment').populate('service').populate('stack').execPopulate(() => resolve(doc))
        })
    })
}

export const deleteEnvironmentService = function (id) {
    return new Promise((resolve, rejects) => {
        findEnvironmentService(id).then((doc) => {
            doc.delete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

