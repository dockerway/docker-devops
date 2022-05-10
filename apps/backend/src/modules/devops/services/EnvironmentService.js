import Environment from './../models/EnvironmentModel'
import {UserInputError} from 'apollo-server-express'
import { environmentsAllowedView } from './EnvironmentAllowedService';

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

    const doc = new Environment({
        name, dockerApiUrl, dockerApiToken, type
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

            resolve(doc)
        }))
    })
}

export const updateEnvironment = async function (authUser, id, {name, dockerApiUrl, dockerApiToken, type}) {
    return new Promise((resolve, rejects) => {
        Environment.findOneAndUpdate({_id: id},
        {name, dockerApiUrl, dockerApiToken, type}, 
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {
            
            if (error) {
                if (error.name == "ValidationError") {
                 return rejects(new UserInputError(error.message, {inputErrors: error.errors}));
                
                }
                return rejects(error)
                
            } 
        
            resolve(doc)
        })
    })
}

export const deleteEnvironment = function (id) {
    return new Promise((resolve, rejects) => {
        findEnvironment(id).then((doc) => {
            doc.delete(function (err) {
                err ? rejects(err) : resolve({id: id, success: true})
            });
        })
    })
}

