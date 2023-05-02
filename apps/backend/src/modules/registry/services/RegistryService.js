import Registry from './../models/RegistryModel'
import { UserInputError } from 'apollo-server-express'

export const findRegistry = async function (id) {
    try {
        return await Registry.findOne({ _id: id }).exec()
    } catch (error) {
        throw error
    }
}

export const fetchRegistry = async function () {
    try {
        return await Registry.find({}).exec()
    } catch (error) {
        throw error
    }
}

export const paginateRegistry = function (pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {

    function qs(search, filters) {
        let qs = {}
        if (search) {
            qs = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { url: { $regex: search, $options: 'i' } }
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

    let query = qs(search, filters)
    let populate = null
    let sort = getSort(orderBy, orderDesc)
    let params = { page: pageNumber, limit: itemsPerPage, populate, sort }

    return new Promise((resolve, reject) => {
        Registry.paginate(query, params).then(result => {
            resolve({ items: result.docs, totalItems: result.totalDocs, page: result.page })
        }
        ).catch(err => reject(err))
    })
}





export const createRegistry = async function (authUser, { name, url, auth, username, password }) {
    const doc = new Registry({ name, url, auth, username, password })
    doc.id = doc._id

    try {
        await doc.save()
        return doc
    } catch (error) {
        if (error.name == "ValidationError") throw new UserInputError(error.message, { inputErrors: error.errors })
        throw error
    }
}

export const updateRegistry = async function (authUser, id, { name, url, auth, username, password }) {
    try {
        return (await Registry.findOneAndUpdate(
            { _id: id },
            { name, url, auth, username, password },
            { new: true, runValidators: true, context: 'query' }
        ))
    } catch (error) {
        if (error.name == "ValidationError") throw new UserInputError(error.message, { inputErrors: error.errors })
        throw error
    }
}

export const deleteRegistry = async function (id) {
    try {
        await (await findRegistry(id)).delete()
        return { id: id, success: true }
    } catch (error) {
        throw error
    }
}

