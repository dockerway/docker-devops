import {findEnvironmentService} from "./EnvironmentServiceService";
import axios from 'axios'

export const findServiceTag = function (id) {
    return new Promise(async (resolve, reject) => {
        try {


           let environmentService = await findEnvironmentService(id)

            let dockerApiUrl = environmentService.environment.dockerApiUrl

            let serviceName = environmentService.stack + "_" + environmentService.service.name

            let path = '/api/docker/service/'+serviceName+'/tag'
            const URL = dockerApiUrl + path

            console.log("URL FINAL", URL)

            let response = await axios.get(URL)

            if(response.status = 200){

                console.log("findServiceTag Response ", response.data)
                resolve(response.data)
            }


        } catch (e) {
            reject(e)
        }

    })
}
