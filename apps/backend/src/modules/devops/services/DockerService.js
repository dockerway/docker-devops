import { findEnvironmentService } from "./EnvironmentServiceService";
import { findEnvironment } from "./EnvironmentService";
import { canUserDeploy } from "./EnvironmentAllowedService";
import { createAudit } from "@dracul/audit-backend";
import axios from 'axios';

export const findDockerServiceTag = async function (id) {
    try {
        const environmentService = await findEnvironmentService(id)
        const token = environmentService.environment.dockerApiToken
        const dockerApiUrl = environmentService.environment.dockerApiUrl

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName

        const path = '/api/docker/service/' + fullServiceName + '/tag'
        const URL = dockerApiUrl + path

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const response = await axios.get(URL, headers)

        if (response.status = 200) {
            return response.data
        } else {
            throw new Error(response)
        }

    } catch (error) {
        const message = error.message + ". " + (error.response?.data ? error.response.data : '');
        throw new Error(message)
    }
}

export const findDockerServiceStats = async function (id) {
    try {
        const environmentService = await findEnvironmentService(id)
        const token = environmentService.environment.dockerApiToken
        const dockerApiUrl = environmentService.environment.dockerApiUrl

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName

        const path = '/api/docker/service/' + fullServiceName + '/stats'
        const URL = dockerApiUrl + path

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const response = await axios.get(URL, headers)

        if (response.status = 200) {
            return response.data
        } else {
            throw new Error(response)
        }


    } catch (error) {
        const message = error.message + ". " + (error.response?.data ? error.response.data : '')
        throw new Error(message)
    }
}

export const findDockerService = async function (id) {
    try {
        const environmentService = await findEnvironmentService(id)
        const token = environmentService.environment.dockerApiToken
        const dockerApiUrl = environmentService.environment.dockerApiUrl

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName

        const path = '/api/docker/service/' + fullServiceName
        const URL = dockerApiUrl + path

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const response = await axios.get(URL, headers)

        console.log(`response status = '${response.status}'`)

        if (response.status == 200) {
            return response.data
        }else{
            throw new Error(response)
        }


    } catch (error) {
        console.log(`error status = '${error}'`)
        if (error.message.includes('404')) return error.message

        throw new Error(error.message + ". " + (error.response?.data ? error.response.data : ''))
    }
}

export const fetchDockerService = async function (environmentId) {
    try {
        const environment = await findEnvironment(environmentId)
        const token = environment.dockerApiToken
        const dockerApiUrl = environment.dockerApiUrl
        const path = '/api/docker/service'
        const URL = dockerApiUrl + path

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const response = await axios.get(URL, headers)

        if (response.status = 200) {
            return response.data
        } else {
            throw new Error(response)
        }

    } catch (error) {
        const message = error.message + ". " + (error.response?.data ? error.response.data : '')
        throw message
    }
}

async function getDockerApiConfig(id) {
    const environmentService = await findEnvironmentService(id)
    const token = environmentService.environment.dockerApiToken
    const dockerApiUrl = environmentService.environment.dockerApiUrl
    const headers = { headers: { 'Authorization': `Bearer ${token}` } }
    const createFoldersPath = '/api/docker/folders'
    const createFoldersURL = dockerApiUrl + createFoldersPath

    return {
        environmentService,
        dockerApiUrl,
        headers,
        createFoldersPath,
        createFoldersURL
    }
}

function createVerifiedFolders(environmentService) {
    try {
        if (environmentService.volumes) {

            console.log('environmentService.volumes: ', environmentService.volumes)
            const verifiedVolumes = environmentService.volumes.map( volume => volume.hostVolume )
            console.log('verifiedVolumes: ', verifiedVolumes)

            return verifiedVolumes
        }else{
            throw new Error('The createVerifiedFolders functions needs an environment service as a parameter!')
        }
    } catch (error) {
        console.error(`An error happened at the createVerifiedFolders function: '${error}'`)
        throw error
    }
}


export const createDockerService = async function (authUser, id, targetImage) {
    try {
        const { environmentService, dockerApiUrl, headers, createFoldersURL } = await getDockerApiConfig(id)
        const verifiedFolders = createVerifiedFolders(environmentService)
        const filesURL = dockerApiUrl + '/api/docker/files'

        if (! await canUserDeploy(authUser, environmentService.environment.type)) throw new Error("El usuario no tiene permiso para desplegar este servicio")

        console.log('verifiedFolders: ', verifiedFolders)
        const createFolder = await axios.post(createFoldersURL, verifiedFolders, headers)
        console.log('createFolder: ', createFolder.data)

        if (environmentService.files) { //files are sent to fortes as volumes
            await axios.post(filesURL, environmentService.files, headers)

            environmentService.volumes = [...environmentService.volumes, ...environmentService.files.map(file => {
                return {
                    hostVolume: file.hostPath + "/" + file.fileName,
                    containerVolume: file.containerPath + "/" + file.fileName
                }
            })]
        }

        //ELIMINA DUPLICADOS
        environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({ hostVolume: a.hostVolume, containerVolume: a.containerVolume })))].map(a => JSON.parse(a))

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName

        // envService limits
        environmentService.limits.memoryReservation = parseFloat(environmentService.limits.memoryReservation * 1048576)
        environmentService.limits.memoryLimit = parseFloat(environmentService.limits.memoryLimit * 1048576)

        environmentService.limits.CPUReservation = parseFloat(environmentService.limits.CPUReservation * 1000000000)
        environmentService.limits.CPULimit = parseFloat(environmentService.limits.CPULimit * 1000000000)

        // data mapping for POST request to fortes
        const data = {
            name: fullServiceName,
            stack: environmentService.stack.name,
            image: targetImage ? targetImage : environmentService.image,
            replicas: environmentService.replicas,
            volumes: environmentService.volumes ? environmentService.volumes : [],
            ports: environmentService.ports ? environmentService.ports : [],
            envs: environmentService.envs ? environmentService.envs : [],
            labels: environmentService.labels ? environmentService.labels : [],
            constraints: environmentService.constraints ? environmentService.constraints : [],
            limits: environmentService.limits ? environmentService.limits : {},
            preferences: environmentService.preferences ? environmentService.preferences : [],
            networks: environmentService.networks ? environmentService.networks : [],
        }

        const URL = dockerApiUrl + '/api/docker/service'
        const response = await axios.post(URL, data, headers);

        if (response.status = 200) {
            await createAudit(authUser, { user: authUser.id, action: 'Deploy docker service', resource: data.name, description: JSON.stringify(data) })
            return response.data
        } else {
            throw new Error(response);
        }

    } catch (error) {
        const message = error.message + ". " + (error.response?.data ? error.response.data : '')
        throw message
    }
}


export const updateDockerService = async function (id, targetImage = null, user) {
    try {
        const { environmentService, dockerApiUrl, headers, createFoldersURL } = await getDockerApiConfig(id)
        const verifiedFolders = createVerifiedFolders(environmentService)
        const filesURL = dockerApiUrl + '/api/docker/files'

        if (! await canUserDeploy(user, environmentService.environment.type)) throw new Error("El usuario no tiene permiso para actualizar este servicio")

        console.log(`verifiedFolders updateDocker: '${verifiedFolders}'`)
        const createFolder = await axios.post(createFoldersURL, verifiedFolders, headers)
        console.log(`createFolder: '${createFolder}'`)

        if (environmentService.files) {
            //files are sent to fortes as volumes
            await axios.post(filesURL, environmentService.files, headers)

            environmentService.volumes = [...environmentService.volumes, ...environmentService.files.map(file => {
                return {
                    hostVolume: file.hostPath + "/" + file.fileName,
                    containerVolume: file.containerPath + "/" + file.fileName
                }
            })]
        }

        //ELIMINA DUPLICADOS
        environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({ hostVolume: a.hostVolume, containerVolume: a.containerVolume })))].map(a => JSON.parse(a))

        const dockerService = await findDockerService(id)
        if (!dockerService) throw new Error("DockerService not found. ID:" + id)

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName

        const limits = {
            memoryReservation: parseFloat(environmentService.limits.memoryReservation * 1048576),
            memoryLimit: parseFloat(environmentService.limits.memoryLimit * 1048576),
            CPUReservation: parseFloat(environmentService.limits.CPUReservation * 1000000000),
            CPULimit: parseFloat(environmentService.limits.CPULimit * 1000000000)
        }

        const data = {
            name: fullServiceName,
            stack: environmentService.stack.name,
            image: targetImage ? targetImage : environmentService.image,
            replicas: environmentService.replicas,
            volumes: environmentService.volumes ? environmentService.volumes : [],
            ports: environmentService.ports ? environmentService.ports : [],
            envs: environmentService.envs ? environmentService.envs : [],
            labels: environmentService.labels ? environmentService.labels : [],
            constraints: environmentService.constraints ? environmentService.constraints : [],
            limits: environmentService.limits ? limits : {},
            preferences: environmentService.preferences ? environmentService.preferences : [],
            networks: environmentService.networks ? environmentService.networks : [],
        }

        const URL = dockerApiUrl + '/api/docker/service/' + dockerService.id
        const response = await axios.put(URL, data, headers)
        if (response.status = 200) {
            if (response?.data?.image?.fullname) {
                environmentService.image = response?.data?.image?.fullname
                await environmentService.save()
            }

            await createAudit(user, { user: user.id, action: 'Update docker service', resource: `${data.name}` })
            return response.data
        } else {
            throw new Error(response)
        }

    } catch (error) {
        const message = error.message + ". " + (error.response?.data ? error.response.data : '')
        throw new Error(message)
    }
}

