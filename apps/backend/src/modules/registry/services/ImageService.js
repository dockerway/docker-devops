import axios from 'axios'
import {fetchRegistry, findRegistry} from "./RegistryService";


export const fetchImage = function (registryId, rows = 1000) {
    return new Promise(async (resolve, reject) => {
        try {

            let registry = await findRegistry(registryId)

            let path = '/v2/_catalog'
            const URL = registry.url + path
            const config = {
                params: {
                    n: rows
                }
            }

            let response = await axios.get(URL, config)

            if (response.status = 200) {
                //console.log("fetchImage", response.data)
                let r = response.data.repositories.map(i => ({name: i, tags: null}))
                // console.log("fetchImage", r)
                resolve(r)
            }


        } catch (e) {
            reject(e)
        }

    })
}

export const imageTags = function (registryId, name) {
    return new Promise(async (resolve, reject) => {
        try {

            let registry = await findRegistry(registryId)

            let path = '/v2/' + name + '/tags/list'
            const URL = registry.url + path
            console.log("URL", URL)
            const config = {}

            let response = await axios.get(URL, config)

            if (response.status = 200) {
                console.log("imageTags", response.data)
                resolve(response.data)
            }


        } catch (e) {
            reject(e)
        }

    })
}


export const imageTagsByFullname = function (name) {
    return new Promise(async (resolve, reject) => {
        try {


            async function searchRegistry(imageName) {
                let registries = await fetchRegistry()
                for (let registry of registries) {
                    if (imageName.includes(registry.domain)) {
                        return registry
                    }
                }
            }

            function getImageBaseName(registry, imageName) {
                return imageName.replace(registry.domain, "")
            }

            if (/:/.test(name)) {
                name = name.split(":")[0]
            }

            let registry = await searchRegistry(name)

            if (registry) {
                let tags = imageTags(registry.id, getImageBaseName(registry,name))
                resolve(tags)
            }else{
                reject(new Error("Registry not found"))
            }


        } catch (e) {
            reject(e)
        }

    })
}
