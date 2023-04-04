import { fetchRegistry, findRegistry } from "./RegistryService";
import axios from 'axios';

export const fetchImage = async function (registryId, rows = 1000) {
    try {
        const registry = await findRegistry(registryId)
        const URL = `${registry.url}/v2/_catalog`
        console.log(`URL: '${URL}'`)


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
        console.log(`URL: '${URL}'`)

        const imageTags = (await axios.get(URL, {})).data
        console.log(`Images tags: '${JSON.stringify(imageTags)}'`)

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

            console.log(`About to iterate through registries: "${registries}"`)
            for (let registry of registries) {
                console.log(`current registry: "${registry}"`)
                if (imageName.includes(registry.domain)) return registry
            }
        }

        const getImageBaseName = (registry, imageName) => (imageName.replace(registry.domain, ""))
        if (/:/.test(name)) name = name.split(":")[0]
        console.log(`name: "${name}"`)

        const registry = await searchRegistry(name)
        console.log(`registry: "${registry}"`)

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
