import { findEnvironment } from '../../devops/services/EnvironmentService';
import { DefaultLogger as winston} from '@dracul/logger-backend';

import axios from 'axios';

export const getDockerNetworks = async function (environmentId) {
    try {
        if (!environmentId) throw new Error("EnvironmentId parameter was not provided")

        const environment = await findEnvironment(environmentId)

        const fortesUrl = environment.dockerApiUrl
        const getAllNetworksEndpoint = `${fortesUrl}/api/docker/network`

        const token = environment.dockerApiToken
        const headers = { headers: { 'Authorization': `Bearer ${token}` } }

        const allNetworksGotFromFortes = (await axios.get(getAllNetworksEndpoint, headers)).data
        return allNetworksGotFromFortes
    } catch (error) {
        winston.error(`An error happened at the getAllNodes function: '${error}'`)
        throw error
    }
}