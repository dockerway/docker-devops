import Platform from './../models/PlatformModel'
import {UserInputError} from 'apollo-server-express'
import { createAudit } from '@dracul/audit-backend'

export const findPlatform = async function (id) {
    return new Promise((resolve, reject) => {
        Platform.findOne({_id: id}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findPlatformByName = async function (name) {
    return new Promise((resolve, reject) => {
        Platform.findOne({name: name}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}


export const fetchPlatform = async function () {
    return new Promise((resolve, reject) => {
        Platform.find({}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginatePlatform = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

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
    let populate = null
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        Platform.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





export const createPlatform = async function (authUser, {name}) {
    console.log(`AUTH USER VALUE: ${authUser}`)
    const doc = new Platform({
        name
    })
    doc.id = doc._id;
    return new Promise((resolve, reject) => {
        doc.save((async (error) => {

            if (error) {
                if (error.name == "ValidationError") {
                    return reject(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return reject(error)
            }

            await createAudit(authUser, {user: authUser.id, action: 'Create platform', resource: doc.name})
            resolve(doc)
        }))
    })
}

export const updatePlatform = async function (authUser, id, {name}) {
    return new Promise((resolve, reject) => {

        let platformOriginalName

        findPlatform(id).then(({name}) =>{
            platformOriginalName = name
        })

        Platform.findOneAndUpdate({_id: id},
        {name},
        {new: true, runValidators: true, context: 'query'},
        async (error,doc) => {

            if (error) {
                if (error.name == "ValidationError") {
                 return reject(new UserInputError(error.message, {inputErrors: error.errors}));

                }
                return reject(error)

            }

            const auditDescription = platformOriginalName !== name ? `Resource's new name is ${name}` : ''
            await createAudit(authUser, {user: authUser.id, action:'Update platform',
                resource: platformOriginalName,
                description: auditDescription}
            )

            resolve(doc)
        })
    })
}

export const deletePlatform = function (authUser, id) {
    return new Promise((resolve, reject) => {
        findPlatform(id).then((doc) => {
            doc.delete(async function (err) {
                if (err) reject(err)
            
                await createAudit(authUser, {user: authUser.id, action:'Delete platform', resource: doc.name})
                resolve({id: id, success: true})
            });
        })
    })
}

