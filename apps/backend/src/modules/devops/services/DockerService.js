import {findEnvironmentService} from "./EnvironmentServiceService";
import axios from 'axios'

export const findDockerServiceTag = function (id) {
    return new Promise(async (resolve, reject) => {
        try {


            let environmentService = await findEnvironmentService(id)

            let dockerApiUrl = environmentService.environment.dockerApiUrl

            let serviceName = environmentService.stack.name + "_" + environmentService.service.name

            let path = '/api/docker/service/' + serviceName + '/tag'
            const URL = dockerApiUrl + path

            console.log("URL FINAL", URL)

            let response = await axios.get(URL)

            console.log(response)
            if (response.status = 200) {

                console.log("findServiceTag Response ", response.data)
                resolve(response.data)
            } else {
                reject(response.status)
            }


        } catch (e) {
            reject(e)
        }

    })
}


export const findDockerService = function (id) {
    return new Promise(async (resolve, reject) => {
        try {


            let environmentService = await findEnvironmentService(id)

            let dockerApiUrl = environmentService.environment.dockerApiUrl

            let serviceName = environmentService.stack.name + "_" + environmentService.service.name

            let path = '/api/docker/service/' + serviceName
            const URL = dockerApiUrl + path

            console.log("URL FINAL", URL)

            let response = await axios.get(URL)

            if (response.status = 200) {

                console.log("findServiceTag Response ", response.data)
                resolve(response.data)
            } else {
                reject(response.status)
            }


        } catch (e) {
            reject(e)
        }

    })
}


export const createDockerService = function (id) {
    return new Promise(async (resolve, reject) => {
        try {


            let environmentService = await findEnvironmentService(id)

            let dockerApiUrl = environmentService.environment.dockerApiUrl

            let path = '/api/docker/service'
            const URL = dockerApiUrl + path

            let serviceName = environmentService.stack.name + "_" + environmentService.service.name


            let data = {
                name: serviceName,
                image: environmentService.image,
                replicas: environmentService.replicas,
                volumes: environmentService.volumes ? environmentService.volumes: [] ,
                ports: environmentService.ports ? environmentService.ports : [],
                envs: environmentService.envs ? environmentService.envs : [],
                labels: environmentService.labels ? environmentService.labels : []
            }

            console.log(data)

            let response = await axios.post(URL, data)

            if (response.status = 200) {

                console.log("findServiceTag Response ", response.data)
                resolve(response.data)
            }


        } catch (e) {
            reject(e)
        }

    })
}
