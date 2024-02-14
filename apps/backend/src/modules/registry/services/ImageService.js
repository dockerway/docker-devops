import { DefaultLogger as winston } from "@dracul/logger-backend";
import { fetchRegistry, findRegistry } from "./RegistryService";
import axios from 'axios';

export const fetchImage = async function (registryId, rows = 1000) {
    try {
        const registry = await findRegistry(registryId)
        const URL = `${registry.url}/v2/_catalog`

        const images = (await axios.get(URL, { params: { n: rows } })).data
        return images.repositories.map(i => ({ name: i, tags: null }))

    } catch (error) {
        console.log(`An error happened when we tried to get the registry '${registryId}'s images`)
        throw (error)
    }
}

export const imageTags = async function (registryId, name) {
    try {
        const registry = await findRegistry(registryId)
        const URL = `${registry.url}/v2/${name}/tags/list`
        const imageTags = (await axios.get(URL, {})).data

        return imageTags
    } catch (error) {
        console.log(`An error happened when we tried to get the image ${name}'s tags in the registry '${registryId}'`)
        throw (error)
    }
}


export const imageTagsByFullname = async function (name) {
    try {
        const searchRegistry = async (imageName) => {
            const registries = await fetchRegistry()

            for (let registry of registries) {
                if (imageName.includes(registry.domain.split(":")[0])) return registry
            }
        }

        const getImageBaseName = (registry, imageName) => (imageName.replace(registry.domain.split(":")[0], ""))
        if (/:/.test(name)) name = name.split(":")[0]

        const registry = await searchRegistry(name)

        if (registry) {
            return imageTags(registry.id, getImageBaseName(registry, name))
        } else {
            throw (new Error("Registry not found"))
        }


    } catch (error) {
        console.log(`An error happened when we tried to get the image "${name}'s tags by its full name"`)
        throw (error)
    }
}
