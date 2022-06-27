import {findEnvironmentService} from "./EnvironmentServiceService";
import {findEnvironment} from "./EnvironmentService";
import { canUserDeploy } from "./EnvironmentAllowedService"
import axios from 'axios'

export const findDockerServiceTag = function (id) {
    return new Promise(async (resolve, reject) => {
        let URL
        try {
            const environmentService = await findEnvironmentService(id);
            const token = environmentService.environment.dockerApiToken;
            const dockerApiUrl = environmentService.environment.dockerApiUrl;

            const serviceName = environmentService.name ? environmentService.name : environmentService.service.name;
            const fullServiceName = environmentService.stack.name + "_" + serviceName;

            const path = '/api/docker/service/' + fullServiceName + '/tag';
            URL = dockerApiUrl + path;

            //console.log("URL FINAL", URL)

            const headers = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get(URL, headers);

            if (response.status = 200) {

                //console.log("findServiceTag Response ", response.data)
                resolve(response.data);
            } else {
                reject(response);
            }


        } catch (e) {
            const message = e.message + ". " + (e.response.data ? e.response.data : '');
            reject(message);
        }

    })
}

export const findDockerServiceStats = function (id) {
    return new Promise(async (resolve, reject) => {
        let URL
        try {
            const environmentService = await findEnvironmentService(id);
            const token = environmentService.environment.dockerApiToken;
            const dockerApiUrl = environmentService.environment.dockerApiUrl;

            const serviceName = environmentService.name ? environmentService.name : environmentService.service.name;
            const fullServiceName = environmentService.stack.name + "_" + serviceName;

            const path = '/api/docker/service/' + fullServiceName + '/stats';
            URL = dockerApiUrl + path;

            const headers = { headers: { 'Authorization': `Bearer ${token}` } };
            let response = await axios.get(URL, headers);

            if (response.status = 200) {
                resolve(response.data);
            } else {
                reject(response);
            }


        } catch (e) {
            const message = e.message + ". " + (e.response.data ? e.response.data : '');
            reject(message);
        }

    })
}

export const findDockerService = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            const environmentService = await findEnvironmentService(id);
            const token = environmentService.environment.dockerApiToken;
            const dockerApiUrl = environmentService.environment.dockerApiUrl;

            const serviceName = environmentService.name ? environmentService.name : environmentService.service.name;
            const fullServiceName = environmentService.stack.name + "_" + serviceName;

            const path = '/api/docker/service/' + fullServiceName;
            const URL = dockerApiUrl + path;

            const headers = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get(URL, headers);

            if (response.status = 200) {
                //console.log("findServiceTag Response ", response.data)
                resolve(response.data);
            } else {
                reject(response);
            }


        } catch (e) {
            const message = e.message + ". " + (e.response.data ? e.response.data : '');
            reject(message);
        }

    })
}

export const fetchDockerService = function (environmentId) {

    return new Promise(async (resolve, reject) => {
        try {
            const environment = await findEnvironment(environmentId);
            const token = environment.dockerApiToken;
            const dockerApiUrl = environment.dockerApiUrl;
            const path = '/api/docker/service';
            const URL = dockerApiUrl + path;
            
            const headers = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get(URL, headers);

            if (response.status = 200) {
                //console.log("fetchDockerService Response ", response.data)
                resolve(response.data);
            } else {
                reject(response);
            }


        } catch (e) {
            const message = e.message + ". " + (e.response.data ? e.response.data : '');
            reject(message);
        }

    })
}

export const createDockerService = function (id, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let environmentService = await findEnvironmentService(id);
            const token = environmentService.environment.dockerApiToken;
            
            let createFoldersPath = '/api/docker/folders'
            const createFoldersURL = dockerApiUrl + createFoldersPath
            
            let createFoldersResponse;
            if(environmentService.volumes){
                createFoldersResponse = await axios.post(createFoldersURL, environmentService.volumes)
            }

            let filesPath = '/api/docker/files'
            const filesURL = dockerApiUrl + filesPath

            let filesCreatedResponse;
            if(environmentService.files){                
                //Los archivos (files) son agregados y enviados a fortes como Volumenes (volumes).
                filesCreatedResponse = await axios.post(filesURL, environmentService.files, headers)

                environmentService.volumes = [...environmentService.volumes, ...environmentService.files.map(file => {
                    return {
                        hostVolume: file.hostPath + file.fileName,
                        containerVolume: file.containerPath + file.fileName
                    }
                })]
            }
            //ELIMINA DUPLICADOS
            environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({hostVolume: a.hostVolume, containerVolume: a.containerVolume})))].map(a => JSON.parse(a))

            if (! await canUserDeploy(user, environmentService.environment.type)) {
                return reject("El usuario no tiene permiso para desplegar este servicio");
            }

            const dockerApiUrl = environmentService.environment.dockerApiUrl;
            
            const path = '/api/docker/service';
            const URL = dockerApiUrl + path;
            
            const serviceName = environmentService.name ? environmentService.name : environmentService.service.name;
            const fullServiceName = environmentService.stack.name + "_" + serviceName;


            environmentService.limits.memoryReservation = parseFloat(environmentService.limits.memoryReservation * 1048576);
            environmentService.limits.memoryLimit = parseFloat(environmentService.limits.memoryLimit * 1048576);

            environmentService.limits.CPUReservation = parseFloat(environmentService.limits.CPUReservation * 1000000000);
            environmentService.limits.CPULimit = parseFloat(environmentService.limits.CPULimit * 1000000000);

            let data = {
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
            };

            const headers = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.post(URL, data, headers);

            if (response.status = 200) {
                resolve(response.data);
            } else {
                reject(response);
            }


        } catch (e) {
            const message = e.message + ". " + (e.response.data ? e.response.data : '');
            reject(message);
        }

    })
}


export const updateDockerService = function (id, targetImage = null, user) {
    return new Promise(async (resolve, reject) => {
        try {
            let environmentService = await findEnvironmentService(id)
            const token = environmentService.environment.dockerApiToken

            const headers = { headers: { 'Authorization': `Bearer ${token}` } }
            const dockerApiUrl = environmentService.environment.dockerApiUrl;

            let createFoldersPath = '/api/docker/folders'
            const createFoldersURL = dockerApiUrl + createFoldersPath

            let createFoldersResponse;
            if(environmentService.volumes){
                createFoldersResponse = await axios.post(createFoldersURL, environmentService.volumes)
            }
            
            let filesPath = '/api/docker/files'
            const filesURL = dockerApiUrl + filesPath

            let filesCreatedResponse;
            if(environmentService.files){
                //Los archivos (files) son agregados y enviados a fortes como Volumenes (volumes).
                filesCreatedResponse = await axios.post(filesURL, environmentService.files, headers)
                environmentService.volumes = [...environmentService.volumes, ...environmentService.files.map(file => {
                    return {
                        hostVolume: file.hostPath + file.fileName,
                        containerVolume: file.containerPath + file.fileName
                    }
                })]
            }
            //ELIMINA DUPLICADOS
            environmentService.volumes = [...new Set(environmentService.volumes.map(a => JSON.stringify({hostVolume: a.hostVolume, containerVolume: a.containerVolume})))].map(a => JSON.parse(a))

            if (! await canUserDeploy(user, environmentService.environment.type)) {
                return reject("El usuario no tiene permiso para actualizar este servicio");
            }

            const dockerService = await findDockerService(id);

            if (!dockerService) {
                reject("DockerService not found. ID:" + id);
            }

            const path = '/api/docker/service/' + dockerService.id;
            const URL = dockerApiUrl + path;


            const serviceName = environmentService.name ? environmentService.name : environmentService.service.name;
            const fullServiceName = environmentService.stack.name + "_" + serviceName;

            const limits = {
                memoryReservation: parseFloat(environmentService.limits.memoryReservation * 1048576),
                memoryLimit: parseFloat(environmentService.limits.memoryLimit * 1048576),
                CPUReservation: parseFloat(environmentService.limits.CPUReservation * 1000000000),
                CPULimit: parseFloat(environmentService.limits.CPULimit * 1000000000)
            };

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
            };

            const response = await axios.put(URL, data, headers);
            if (response.status = 200) {
                if(response?.data?.image?.fullname){
                    environmentService.image = response?.data?.image?.fullname;
                    await environmentService.save();
                }

                resolve(response.data);
            } else {
                reject(response);
            }


        } catch (e) {
            const message = e.message + ". " + (e.response.data ? e.response.data : '');
            reject(message);
        }

    })
}

