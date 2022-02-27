import {findEnvironmentService} from "./EnvironmentServiceService";
import axios from 'axios'
import {findEnvironment} from "./EnvironmentService";

export const findDockerServiceTag = function (id) {
    return new Promise(async (resolve, reject) => {
        try {


            let environmentService = await findEnvironmentService(id)

            let dockerApiUrl = environmentService.environment.dockerApiUrl

            let serviceName = environmentService.name ? environmentService.name :  environmentService.service.name
            let fullServiceName = environmentService.stack.name + "_" + serviceName

            let path = '/api/docker/service/' + fullServiceName + '/tag'
            const URL = dockerApiUrl + path

            console.log("URL FINAL", URL)

            let response = await axios.get(URL)

            console.log(response)
            if (response.status = 200) {

                //console.log("findServiceTag Response ", response.data)
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


            let serviceName = environmentService.name ? environmentService.name :  environmentService.service.name
            let fullServiceName = environmentService.stack.name + "_" + serviceName

            let path = '/api/docker/service/' + fullServiceName
            const URL = dockerApiUrl + path

            console.log("URL FINAL", URL)

            let response = await axios.get(URL)

            if (response.status = 200) {

                //console.log("findServiceTag Response ", response.data)
                resolve(response.data)
            } else {
                reject(response.status)
            }


        } catch (e) {
            reject(e)
        }

    })
}

export const  fetchDockerService = function (environmentId) {

    return new Promise(async (resolve, reject) => {
        try {

            let environment = await findEnvironment(environmentId)
            let dockerApiUrl = environment.dockerApiUrl


            let path = '/api/docker/service'
            const URL = dockerApiUrl + path

            console.log("URL FINAL", URL)

            let response = await axios.get(URL)

            if (response.status = 200) {

                //console.log("fetchDockerService Response ", response.data)
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

            let serviceName = environmentService.name ? environmentService.name :  environmentService.service.name
            let fullServiceName = environmentService.stack.name + "_" + serviceName

            let data = {
                name: fullServiceName,
                stack: environmentService.stack.name,
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

                console.log("createDockerService Response ", response.data)
                resolve(response.data)
            }else{
                reject(response)
            }


        } catch (e) {
            console.log(e)
            let message = e.message +". " +(e.response.data ? e.response.data : '')
            reject(message)
        }

    })
}


export const updateDockerService = function (id) {
    return new Promise(async (resolve, reject) => {
        try {


            let environmentService = await findEnvironmentService(id)
            let dockerService = await findDockerService(id)

            if(!dockerService){
                reject("DockerService not found. ID:"+id )
            }

            let dockerApiUrl = environmentService.environment.dockerApiUrl

            let path = '/api/docker/service/'+ dockerService.id
            const URL = dockerApiUrl + path


            let serviceName = environmentService.name ? environmentService.name :  environmentService.service.name
            let fullServiceName = environmentService.stack.name + "_" + serviceName


            let data = {
                name: fullServiceName,
                stack: environmentService.stack.name,
                image: environmentService.image,
                replicas: environmentService.replicas,
                volumes: environmentService.volumes ? environmentService.volumes: [] ,
                ports: environmentService.ports ? environmentService.ports : [],
                envs: environmentService.envs ? environmentService.envs : [],
                labels: environmentService.labels ? environmentService.labels : []
            }

            console.log(data)

            let response = await axios.put(URL, data)

            if (response.status = 200) {

                console.log("updateDockerService Response ", response.data)
                resolve(response.data)
            }else{
                reject(response)
            }


        } catch (e) {
            console.log(e)
            let message = e.message +". " +(e.response.data ? e.response.data : '')
            reject(message)
        }

    })
}
