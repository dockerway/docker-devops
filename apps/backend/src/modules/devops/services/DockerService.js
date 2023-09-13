import { findEnvironmentService } from "./EnvironmentServiceService";
import { findEnvironment } from "./EnvironmentService";
import { canUserDeploy } from "./EnvironmentAllowedService";
import { createAudit } from "@dracul/audit-backend";
import axios from 'axios';

const notMountedMessage = 'The needed directories are not mounted; please contact your infrastructure team!' //has to match the agent's notMountedMessage

export const findDockerServiceTag = async function (id) {
    try {
        const environmentService = await findEnvironmentService(id)
        const token = environmentService.environment.dockerApiToken
        const dockerApiUrl = environmentService.environment.dockerApiUrl

        const environmentServiceName = environmentService.name ? environmentService.name : environmentService.service.name

        const fullServiceName = environmentService.stack.name + "_" + serviceName

        const path = '/api/docker/service/' + fullServiceName + '/tag'
        const URL = (serviceName) => dockerApiUrl + path(serviceName)

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const response = await axios.get(URL(environmentServiceName), headers).catch(async (error) => {
            if (error?.response?.status == 500) return { data: 'El servicio no existe' }
        })

        if (response && response.status == 200 || response && response.data === 'El servicio no existe') return response.data

    } catch (error) {
        console.error(`An error happened at the findDockerServiceTag function: ${error.message ? error.message : error} `)
        const message = error.message + ". " + (error.response?.data ? error.response.data : '')
        throw new Error(message)
    }
}

export const findDockerServiceStats = async function (id) {
    try {
        const environmentService = await findEnvironmentService(id)
        const token = environmentService.environment.dockerApiToken
        const dockerApiUrl = environmentService.environment.dockerApiUrl

        const environmentServiceName = environmentService.name ? environmentService.name : environmentService.service.name

        const fullServiceName = environmentService.stack.name + "_" + serviceName
        const path = '/api/docker/service/' + fullServiceName + '/stats'

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const response = await axios.get(URL(environmentServiceName), headers).catch(async (error) => {
            if (error?.response?.status == 500) {
                const serviceNameWithStackNamePrefix = environmentService.stack.name + "_" + environmentServiceName
                const newUrl = URL(serviceNameWithStackNamePrefix)

                console.log(`Trying to search the stats with the old way of naming services: ${serviceNameWithStackNamePrefix} | ${newUrl}`)
                const newResponse = await axios.get(newUrl, headers).catch(() => {
                    if (error?.response?.status == 500) return { data: [] }
                })
                return newResponse
            }
        })

        if (response && response.status == 200 || response && response.data) return response.data
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
        } else {
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

        if (response.status == 200) {
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

function getHostVolumes(environmentServiceVolumes) {
    try {
        if (environmentServiceVolumes && Array.isArray(environmentServiceVolumes)) {
            return environmentServiceVolumes.map(volume => volume.hostVolume)
        } else {
            return []
        }
    } catch (error) {
        console.error(`An error happened at the getHostVolumes function: '${error}'`)
        throw error
    }
}


async function sendFilesToFortes(environmentService, headers, filesURL) {
    try {
        const createFiles = await axios.post(filesURL, environmentService.files, headers)
        if (createFiles.data === notMountedMessage) throw new Error(notMountedMessage)

        environmentService.volumes = [...environmentService.volumes, ...environmentService.files.map(file => {
            return {
                hostVolume: file.hostPath + "/" + file.fileName,
                containerVolume: file.containerPath + "/" + file.fileName
            }
        })]
    } catch (error) {
        if (error.message != notMountedMessage) console.error(`An error happened at sendFilesToFortes: '${error}'`)
        throw error
    }
}

async function createFolders(verifiedFolders, headers, createFoldersURL) {
    try {
        const createFolder = await axios.post(createFoldersURL, verifiedFolders, headers)
        if (createFolder.data === notMountedMessage) throw new Error(notMountedMessage)
    } catch (error) {
        if (error.message != notMountedMessage) console.error(`An error happened at the createFolders function: ${error}`)
        throw error
    }
}

function normalizeEnvironmentServiceData(serviceName, environmentService, targetImage) {
    try {
        const limits = {
            memoryReservation: environmentService.limits.memoryReservation ? parseFloat(environmentService.limits.memoryReservation * 1048576) : null,
            memoryLimit: environmentService.limits.memoryLimit ? parseFloat(environmentService.limits.memoryLimit * 1048576) : null,
            CPUReservation: environmentService.limits.CPUReservation ? parseFloat(environmentService.limits.CPUReservation * 1000000000) : null,
            CPULimit: environmentService.limits.CPULimit ? parseFloat(environmentService.limits.CPULimit * 1000000000) : null
        }

        return {
            name: serviceName,
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
            command: environmentService.command
        }
    } catch (error) {
        console.error(`An error happened at the normalizeEnvironmentServiceData function: '${error.message}'`)
        throw error
    }

}

export const createDockerService = async function (authUser, id, targetImage) {
    try {
        const { environmentService, dockerApiUrl, headers, createFoldersURL } = await getDockerApiConfig(id)
        const hostVolumes = getHostVolumes(environmentService.volumes)
        const filesURL = dockerApiUrl + '/api/docker/files'

        if (! await canUserDeploy(authUser, environmentService.environment.type)) throw new Error("El usuario no tiene permiso para desplegar este servicio")

        if (hostVolumes.length > 0) await createFolders(hostVolumes, headers, createFoldersURL)
        if (environmentService.files) await sendFilesToFortes(environmentService, headers, filesURL)

        //ELIMINA DUPLICADOS
        environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({ hostVolume: a.hostVolume, containerVolume: a.containerVolume })))].map(a => JSON.parse(a))

        console.log(`environmentService: ${JSON.stringify(environmentService, null, 2)}`)
        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName
        const serviceData = normalizeEnvironmentServiceData(fullServiceName, environmentService, targetImage)

        const URL = dockerApiUrl + '/api/docker/service'
        const response = await axios.post(URL, serviceData, headers);

        if (response.status == 200) {
            await createAudit(authUser, { user: authUser.id, action: 'Deploy docker service', resource: serviceData.name, description: JSON.stringify(serviceData) })
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

        environmentService.image = targetImage
        await environmentService.save()

        const hostVolumes = getHostVolumes(environmentService.volumes)
        const filesURL = dockerApiUrl + '/api/docker/files'
        const dockerService = await findDockerService(id)

        if (! await canUserDeploy(user, environmentService.environment.type)) throw new Error("El usuario no tiene permiso para actualizar este servicio")
        if (!dockerService) throw new Error("DockerService not found. ID:" + id)


        if (hostVolumes.length > 0) await createFolders(hostVolumes, headers, createFoldersURL)
        if (environmentService.files) await sendFilesToFortes(environmentService, headers, filesURL)

        //ELIMINA DUPLICADOS
        environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({ hostVolume: a.hostVolume, containerVolume: a.containerVolume })))].map(a => JSON.parse(a))

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName
        const serviceData = normalizeEnvironmentServiceData(fullServiceName, environmentService, targetImage)

        const URL = dockerApiUrl + '/api/docker/service/' + dockerService.id
        const response = await axios.put(URL, serviceData, headers)

        if (response.status == 200) {
            await createAudit(user, { user: user.id, action: 'Update docker service', resource: `${serviceData.name}` })
            return response.data
        } else {
            throw new Error(response)
        }

    } catch (error) {
        const message = error.message + ". " + (error.response?.data ? error.response.data : '')
        throw new Error(message)
    }
}

