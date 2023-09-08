import Environment from './../models/EnvironmentModel'
import { UserInputError } from 'apollo-server-express'
import { environmentsAllowedView } from './EnvironmentAllowedService';
import { createAudit } from "@dracul/audit-backend"

export const findEnvironment = async function (id) {
    try {
        return await Environment.findOne({ _id: id }).exec()
    } catch (error) {
        console.log('An error happened when we tried to fetch the environments: ', error)
        throw error
    }
}

export const fetchEnvironment = async function (user) {
    if(!user) throw new Error("No user parameter was provided at the fetchEnvironment function")

    try {
        const envsAllowed = await environmentsAllowedView(user)
        return await (Environment.find({ _id: { $in: envsAllowed } }).exec())
    } catch (error) {
        console.log('An error happened when we tried to fetch the environments: ', error)
        throw error
    }
}

export const fetchEnvironmentByTypes = async function (types) {
    try {
        return await Environment.find({ type: { $in: types } }).exec()
    } catch (error) {
        console.log('An error happened when we tried to fetch the environments by type: ', error)
        throw error
    }
}

export const paginateEnvironment = async function (pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {
    const query = createQuery(search, filters);
    const sort = createSort(orderBy, orderDesc);
    const options = { page: pageNumber, limit: itemsPerPage, sort };
    
    try {
        const result = await Environment.paginate(query, options);
        return { items: result.docs, totalItems: result.totalDocs, page: result.page };
    } catch (err) {
        throw err;
    }
}

function createQuery(search, filters) {
    if (!search && !filters) return {};
    const query = {};
    
    if (search) {
        query.$or = [{ name: { $regex: search, $options: 'i' } }];
    }

    if (filters) {
        filters.forEach(filter => {
            const operator = getOperator(filter.operator);
            query[filter.field] = { ...query[filter.field], [operator]: filter.value };
        });
    }

    return query;
}

function createSort(orderBy, orderDesc) {
    if (!orderBy) return null;
    return (orderDesc ? '-' : '') + orderBy;
}

function getOperator(operator) {
    switch (operator) {
        case '=':
        case 'eq':
            return '$eq';
        case 'contain':
        case 'regex':
            return '$regex';
        case '>':
        case 'gt':
            return '$gt';
        case '<':
        case 'lt':
            return '$lt';
        case '>=':
        case 'gte':
            return '$gte';
        case '<=':
        case 'lte':
            return '$lte';
        default:
            return '$eq';
    }
}

export const createEnvironment = async function (authUser, { name, dockerApiUrl, dockerApiToken, type }) {
    dockerApiUrl = dockerApiUrl.replace(/\/+$/, '')

    const doc = new Environment({ name, dockerApiUrl, dockerApiToken, type })
    doc.id = doc._id

    try {
        await doc.save()
        await createAudit(authUser, { user: authUser.id, action: 'Create environment', resource: `${doc.name}` })
        
        return doc
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, { inputErrors: error.errors })
        }

        throw error
    }
}


export const updateEnvironment = async function (authUser, id, { name, dockerApiUrl, dockerApiToken, type }) {
    return new Promise((resolve, reject) => {

        let envOriginalName

        findEnvironment(id).then(({ name }) => {
            envOriginalName = name
        })

        dockerApiUrl = dockerApiUrl.replace(/\/+$/, '')

        Environment.findOneAndUpdate({ _id: id },
            { name, dockerApiUrl, dockerApiToken, type },
            { new: true, runValidators: true, context: 'query' },
            async (error, doc) => {

                if (error) {
                    if (error.name == "ValidationError") {
                        return reject(new UserInputError(error.message, { inputErrors: error.errors }));

                    }
                    return reject(error)

                }

                const auditDescription = envOriginalName !== name ? `Resource's new name is ${name}` : ''
                await createAudit(authUser, {
                    user: authUser.id, action: 'Update environment',
                    resource: envOriginalName,
                    description: auditDescription
                }
                )

                resolve(doc)
            })
    })
}

export const deleteEnvironment = async function (authUser, id) {
    const environment = await findEnvironment(id)

    await environment.delete()
    await createAudit(authUser, { user: authUser.id, action: 'Delete environment', resource: `${doc.name}` })

    return ({ id: id, success: true })
}

