import Service from './../models/ServiceModel'
import {UserInputError} from 'apollo-server-express'

export const findService = async function (id) {
    return new Promise((resolve, reject) => {
        Service.findOne({_id: id}).populate('platform').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findServiceByName = async function (name) {
    return new Promise((resolve, reject) => {
        Service.findOne({name: name}).populate('platform').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findServiceByNameAndPlatform = async function (name, platform) {
    return new Promise((resolve, reject) => {
        Service.findOne({name: name, platform: platform}).populate('platform').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findServiceByNameStackPlatform = async function (name, stack, platform) {
    return new Promise((resolve, reject) => {
        Service.findOne({name: name, platform: platform, stack: stack}).populate('platform').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchService = async function () {
    return new Promise((resolve, reject) => {
        Service.find({}).populate('platform').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateService = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    function qs(search, filters) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    {name: {$regex: search, $options: 'i'}}
                ]
            }
        }

        if(filters){

            for(let filter of filters){
                if(!filter.value){
                    continue
                }

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

    let query = qs(search, filters)
    let populate = ['platform']
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        Service.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





export const createService = async function (authUser, {name, description, platform, image, repository, volumes, ports, envs, constraints, limits}) {
    const doc = new Service({
        name, description, platform, image, repository, volumes, ports, envs, constraints, limits
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

            doc.populate('platform').execPopulate(() => resolve(doc))
        }))
    })
}

export const updateService = async function (authUser, id, {name, description, platform, image, repository, volumes, ports, envs, constraints, limits}) {
    return new Promise((resolve, rejects) => {
        Service.findOneAndUpdate({_id: id},
        {name, description, platform, image, repository, volumes, ports, envs, constraints, limits},
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {

            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));

                }
                return rejects(error)

            }

            doc.populate('platform').execPopulate(() => resolve(doc))
        })
    })
}

export const deleteService = function (id) {
    return new Promise((resolve, rejects) => {
        findService(id).then((doc) => {
            doc.delete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

