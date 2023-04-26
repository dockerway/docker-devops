import Stack from './../models/StackModel'
import {UserInputError} from 'apollo-server-express'
import {createAudit} from "@dracul/audit-backend"

export const findStack = async function (id) {
    try {
      return await Stack.findOne({_id: id}).populate('platform').populate('environments').exec()
    } catch (err) {
      throw err
    }
  }
  
  export const findStackByName = async function (name) {
    try {
      return await Stack.findOne({name: name}).populate('platform').populate('environments').exec()
    } catch (err) {
      throw err
    }
  }
  
  export const fetchStack = async function () {
    try {
      return await Stack.find({}).populate('platform').populate('environments').exec()
    } catch (err) {
      throw err
    }
  }
  

  export const paginateStack = async function (pageNumber = 1, itemsPerPage = 5, search = null, filters = null, orderBy = null, orderDesc = false) {
    function qs(search, filters) {
      let qs = {}
      if (search) {
        qs = {
          $or: [
            {name: {$regex: search, $options: 'i'}}
          ]
        }
      }
  
      if (filters) {
  
        for (let filter of filters) {
  
          if (!filter.value) continue
  
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
      return (orderBy) ? (orderDesc ? '-' : '') + orderBy :  null
    }
  
    const query = qs(search, filters)
    const populate = ['platform', 'environments']
    const sort = getSort(orderBy, orderDesc)
    const params = {page: pageNumber, limit: itemsPerPage, populate, sort}
  
    try {
      const result = await Stack.paginate(query, params)
      return {items: result.docs, totalItems: result.totalDocs, page: result.page}
    } catch (err) {
      throw err
    }
  }


  export const createStack = async function (authUser, {name, platform, environments}) {
    if (!new RegExp(/^[^\s]*$/).test(name)) throw new Error('El nombre del stack no debe poseer espacios en blanco')

    const doc = new Stack({name, platform, environments})
    doc.id = doc._id

    try {
      await doc.save()

      const populatedDoc = await doc.populate('platform').populate('environments').execPopulate()
      await createAudit(authUser, {user: authUser.id, action:'Create stack', resource: `${doc.name}`})

      return populatedDoc
    } catch (error) {
      if (error.name == "ValidationError") throw new UserInputError(error.message, {inputErrors: error.errors})
      throw error
    }
  }
  
  export const updateStack = async function (authUser, id, {name, platform, environments}) {
    let stackOriginalName

    try {
      const { name: originalName } = await findStack(id)
      stackOriginalName = originalName
    } catch (error) {
      throw error
    }
  
    try {
      const doc = await Stack.findOneAndUpdate(
        {_id: id},
        {name, platform, environments},
        {new: true, runValidators: true, context: 'query'},
      )
  
      const auditDescription = stackOriginalName !== name ? `Resource's new name is ${name}` : ''
      await createAudit(authUser, {user: authUser.id, action:'Update stack', resource: stackOriginalName, description: auditDescription})
      
      const populatedDoc = await doc.populate('platform').populate('environments').execPopulate()
      return populatedDoc
    } catch (error) {
      if (error.name == "ValidationError") throw new UserInputError(error.message, {inputErrors: error.errors})
      throw error
    }
  }
  
  export const deleteStack = async function (authUser, id) {
    try {
      const stack = await findStack(id)

      await stack.delete()
      await createAudit(authUser, {user: authUser.id, action:'Delete stack', resource: `${stack.name}`})

      return {id: id, success: true}
    } catch (error) {
      throw error
    }
  }
  