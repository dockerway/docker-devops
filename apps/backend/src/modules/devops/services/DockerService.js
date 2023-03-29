import { findEnvironmentService } from "./EnvironmentServiceService";
import { findEnvironment } from "./EnvironmentService";
import { canUserDeploy } from "./EnvironmentAllowedService"
import axios from 'axios'
import { createAudit } from "@dracul/audit-backend";

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

export const createDockerService = async function (authUser, id) {
    try {
        const environmentService = await findEnvironmentService(id);
        const token = environmentService.environment.dockerApiToken;

        const dockerApiUrl = environmentService.environment.dockerApiUrl;
        const headers = { headers: { 'Authorization': `Bearer ${token}` } };

        const createFoldersPath = '/api/docker/folders'
        const createFoldersURL = dockerApiUrl + createFoldersPath

        if (environmentService.volumes) {
            const verifiedVolumes = environmentService.volumes.map(function (vol) { return vol.hostVolume });
            const verifiedFiles = environmentService.files.map(function (file) { return file.hostPath + "/" + file.fileName });
            const verifiedFolders = verifiedVolumes.filter(elem => !elem.includes(verifiedFiles))

            await axios.post(createFoldersURL, verifiedFolders, headers)
        }

        let filesPath = '/api/docker/files'
        const filesURL = dockerApiUrl + filesPath

        if (environmentService.files) {
            //Los archivos (files) son agregados y enviados a fortes como Volumenes (volumes).
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

        if (! await canUserDeploy(authUser, environmentService.environment.type)) throw new Error("El usuario no tiene permiso para desplegar este servicio");

        const path = '/api/docker/service'
        const URL = dockerApiUrl + path

        const serviceName = environmentService.name ? environmentService.name : environmentService.service.name
        const fullServiceName = environmentService.stack.name + "_" + serviceName


        environmentService.limits.memoryReservation = parseFloat(environmentService.limits.memoryReservation * 1048576)
        environmentService.limits.memoryLimit = parseFloat(environmentService.limits.memoryLimit * 1048576)

        environmentService.limits.CPUReservation = parseFloat(environmentService.limits.CPUReservation * 1000000000)
        environmentService.limits.CPULimit = parseFloat(environmentService.limits.CPULimit * 1000000000)

        const data = {
            name: fullServiceName,
            stack: environmentService.stack.name,
            image: environmentService.image,
            replicas: environmentService.replicas,
            volumes: environmentService.volumes ? environmentService.volumes : [],
            ports: environmentService.ports ? environmentService.ports : [],
            envs: environmentService.envs ? environmentService.envs : [],
            labels: environmentService.labels ? environmentService.labels : [],
            constraints: environmentService.constraints ? environmentService.constraints : [],
            limits: environmentService.limits ? environmentService.limits : {},
            preferences: environmentService.preferences ? environmentService.preferences : [],
        }

        const response = await axios.post(URL, data, headers);

        if (response.status = 200) {
            await createAudit(authUser, { user: authUser.id, action: 'Deploy docker service', resource: data.name })
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
        const environmentService = await findEnvironmentService(id)
        const token = environmentService.environment.dockerApiToken

        const headers = { headers: { 'Authorization': `Bearer ${token}` } }
        const dockerApiUrl = environmentService.environment.dockerApiUrl

        let createFoldersPath = '/api/docker/folders'
        const createFoldersURL = dockerApiUrl + createFoldersPath

        let createFoldersResponse;
        if (environmentService.volumes) {
            const verifiedVolumes = environmentService.volumes.map(function (vol) { return vol.hostVolume })
            const verifiedFiles = environmentService.files.map(function (file) { return file.hostPath + "/" + file.fileName })
            const verifiedFolders = verifiedVolumes.filter(elem => !elem.includes(verifiedFiles))

            createFoldersResponse = await axios.post(createFoldersURL, verifiedFolders, headers)
        }

        let filesPath = '/api/docker/files'
        const filesURL = dockerApiUrl + filesPath

        let filesCreatedResponse;
        if (environmentService.files) {
            //Los archivos (files) son agregados y enviados a fortes como Volumenes (volumes).
            filesCreatedResponse = await axios.post(filesURL, environmentService.files, headers)
            environmentService.volumes = [...environmentService.volumes, ...environmentService.files.map(file => {
                return {
                    hostVolume: file.hostPath + "/" + file.fileName,
                    containerVolume: file.containerPath + "/" + file.fileName
                }
            })]
        }
        //ELIMINA DUPLICADOS
        environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({ hostVolume: a.hostVolume, containerVolume: a.containerVolume })))].map(a => JSON.parse(a))

        if (! await canUserDeploy(user, environmentService.environment.type)) throw new Error("El usuario no tiene permiso para actualizar este servicio")

        const dockerService = await findDockerService(id)

        if (!dockerService) throw new Error("DockerService not found. ID:" + id)

        const path = '/api/docker/service/' + dockerService.id
        const URL = dockerApiUrl + path


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
            preferences: environmentService.preferences ? environmentService.preferences : []
        }

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

