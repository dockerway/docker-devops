import Environment from './../models/EnvironmentModel'
import {UserInputError} from 'apollo-server-express'
import { environmentsAllowedView } from './EnvironmentAllowedService';
import { createAudit } from "@dracul/audit-backend"

export const findEnvironment = async function (id) {
    return new Promise((resolve, reject) => {
        Environment.findOne({_id: id}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchEnvironment = function (user) {
    return new Promise(async (resolve, reject) => {
        const envsAllowed = await environmentsAllowedView(user)
        Environment.find({_id: {$in: envsAllowed}}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchEnvironmentByTypes = function (types) {
    return new Promise((resolve, reject) => {
        Environment.find({type: {$in: types}}).exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateEnvironment = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

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
        Environment.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}




export const createEnvironment = async function (authUser, {name, dockerApiUrl, dockerApiToken, type}) {

    dockerApiUrl = dockerApiUrl.replace(/\/+$/, '')

    const doc = new Environment({
        name, dockerApiUrl, dockerApiToken, type
    })
    doc.id = doc._id;
    return new Promise((resolve, reject) => {
        doc.save( (async (error) => {
        
            if (error) {
                if (error.name == "ValidationError") {
                    return reject(new UserInputError(error.message, {inputErrors: error.errors}));
                }
                return reject(error)
            }    

            await createAudit(authUser, {user: authUser.id, action:'Create environment', resource: `${doc.name}`})

            resolve(doc)
        }))
    })
}

export const updateEnvironment = async function (authUser, id, {name, dockerApiUrl, dockerApiToken, type}) {
    return new Promise((resolve, reject) => {

        let envOriginalName

        findEnvironment(id).then(({name}) => {
            envOriginalName = name
        })

        dockerApiUrl = dockerApiUrl.replace(/\/+$/, '')

        Environment.findOneAndUpdate({_id: id},
        {name, dockerApiUrl, dockerApiToken, type}, 
        {new: true, runValidators: true, context: 'query'},
        async (error,doc) => {
            
            if (error) {
                if (error.name == "ValidationError") {
                 return reject(new UserInputError(error.message, {inputErrors: error.errors}));
                
                }
                return reject(error)
                
            } 

            const auditDescription = envOriginalName !== name ? `Resource's new name is ${name}` : ''
            await createAudit(authUser, {user: authUser.id, action:'Update environment',
                resource: envOriginalName,
                description: auditDescription}
            )
        
            resolve(doc)
        })
    })
}

export const deleteEnvironment = function (authUser, id) {
    return new Promise((resolve, reject) => {
        findEnvironment(id).then((doc) => {
            doc.delete(async function (err) {
                if (err) reject(err)
                
                await createAudit(authUser, {user: authUser.id, action:'Delete environment', resource: `${doc.name}`})
                resolve({id: id, success: true})
            });
        })
    })
}

