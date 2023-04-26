import Service from './../models/ServiceModel'
import {UserInputError} from 'apollo-server-express'
import {createAudit} from "@dracul/audit-backend"

export const getServiceById = async function (id) {
    try {
        return await Service.findOne({_id: id}).populate('platform').exec()
    } catch (error) {
        throw error
    }
}

export const getServiceByName = async function (name) {
    try {
        return await Service.findOne({name: name}).populate('platform').exec()
    } catch (error) {
        throw error
    }
}

export const getServiceByNameAndPlatform = async function (name, platform) {
    try {
        return await Service.findOne({name: name, platform: platform}).populate('platform').exec()
    } catch (error) {
        throw error
    }
}

export const getServiceByNameStackPlatform = async function (name, stack, platform) {
    try {
        return await Service.findOne({name: name, platform: platform, stack: stack}).populate('platform').exec()
    } catch (error) {
        throw error
    }
}

export const getAllServices = async function () {
    try {
        return await Service.find({}).populate('platform').exec()
    } catch (error) {
        throw error
    }
}


export async function paginateServices(pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {
    const query = {
      ...(search && {
        $or: [
          { name: { $regex: search, $options: 'i' } },
        ],
      }),
      ...(filters && filters.reduce((acc, filter) => {
        if (filter.value) {
          const operator = {
            '=': '$eq',
            eq: '$eq',
            contain: '$regex',
            regex: '$regex',
            '>': '$gt',
            gt: '$gt',
            '<': '$lt',
            lt: '$lt',
            '>=': '$gte',
            gte: '$gte',
            '<=': '$lte',
            lte: '$lte',
          }[filter.operator] ?? '$eq';
          return { ...acc, [filter.field]: { [operator]: filter.value } }
        }
        return acc
      }, {})),
    }

    const populate = ['platform'];
    const sort = orderBy ? (orderDesc ? `-${orderBy}` : orderBy) : null
    const params = { page: pageNumber, limit: itemsPerPage, populate, sort }
    const result = await Service.paginate(query, params)

    return {
      items: result.docs,
      totalItems: result.totalDocs,
      page: result.page,
    }

  }



export const createService = async function (authUser, {name, description, platform, image, repository, volumes, ports, envs, files, constraints, limits, preferences}) {
    const doc = new Service({
        name, description, platform, image, repository, volumes, ports, envs, files, constraints, limits, preferences
    })
    doc.id = doc._id

    try {
        await doc.save()
        await doc.populate('platform').execPopulate()

        await createAudit(authUser, {user: authUser.id, action: 'Create service', resource: doc.name})

        return doc
    } catch (error) {
        if (error.name == "ValidationError") throw new UserInputError(error.message, {inputErrors: error.errors})
        throw error
    }
}

export const updateService = async function (authUser, id, {name, description, platform, image, repository, volumes, ports, envs, files, constraints, limits, preferences}) {
    const serviceOriginalName = (await getServiceById(id)).name

    try {
        const doc = await Service.findOneAndUpdate(
            {_id: id},
            {name, description, platform, image, repository, volumes, ports, envs, files, constraints, limits, preferences},
            {new: true, runValidators: true, context: 'query'}
        )
        await doc.populate('platform').execPopulate()

        await createAudit(authUser, {
            user: authUser.id,
            action: 'Update service',
            resource: serviceOriginalName,
            description: serviceOriginalName !== name ? `Resource's new name is ${name}` : ''
        })

        return doc
    } catch (error) {
        if (error.name == "ValidationError") {
            throw new UserInputError(error.message, {inputErrors: error.errors})
        }
        throw error
    }
}

export const deleteService = async function (user, id) {
    try {
        const doc = await getServiceById(id)

        await doc.delete()
        await createAudit(user, {user: user.id, action: 'Delete service', resource: doc.name})

        return {id: id, success: true}
    } catch (error) {
        throw error
    }
}
