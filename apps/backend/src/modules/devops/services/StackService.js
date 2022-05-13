import Stack from './../models/StackModel'
import {UserInputError} from 'apollo-server-express'

export const findStack = async function (id) {
    return new Promise((resolve, reject) => {
        Stack.findOne({_id: id}).populate('platform').populate('environments').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const findStackByName = async function (name) {
    return new Promise((resolve, reject) => {
        Stack.findOne({name: name}).populate('platform').populate('environments').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const fetchStack = async function () {
    return new Promise((resolve, reject) => {
        Stack.find({}).populate('platform').populate('environments').exec((err, res) => (
            err ? reject(err) : resolve(res)
        ));
    })
}

export const paginateStack = function ( pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

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
    let populate = ['platform','environments']
    let sort = getSort(orderBy, orderDesc)
    let params = {page: pageNumber, limit: itemsPerPage, populate, sort}

    return new Promise((resolve, reject) => {
        Stack.paginate(query, params).then(result => {
                resolve({items: result.docs, totalItems: result.totalDocs, page: result.page})
            }
        ).catch(err => reject(err))
    })
}





export const createStack = async function (authUser, {name, platform, environments}) {

    const doc = new Stack({
        name, platform, environments
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

            doc.populate('platform').populate('environments').execPopulate(() => resolve(doc))
        }))
    })
}

export const updateStack = async function (authUser, id, {name, platform, environments}) {
    return new Promise((resolve, reject) => {
        Stack.findOneAndUpdate({_id: id},
        {name, platform, environments},
        {new: true, runValidators: true, context: 'query'},
        (error,doc) => {

            if (error) {
                if (error.name == "ValidationError") {
                 return reject(new UserInputError(error.message, {inputErrors: error.errors}));

                }
                return reject(error)

            }

            doc.populate('platform').populate('environments').execPopulate(() => resolve(doc))
        })
    })
}

export const deleteStack = function (id) {
    return new Promise((resolve, reject) => {
        findStack(id).then((doc) => {
            doc.delete(function (err) {
                err ? reject(err) : resolve({id: id, success: true})
            });
        })
    })
}

