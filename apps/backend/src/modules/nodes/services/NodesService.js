import { findEnvironment } from '../../devops/services/EnvironmentService';
import { DefaultLogger as winston} from '@dracul/logger-backend';

import axios from 'axios';



export const getAllNodes = async function (environmentId) {
    try {
        if (!environmentId) throw new Error("EnvironmentId parameter was not provided")

        const environment = await findEnvironment(environmentId)

        const fortesUrl = environment.dockerApiUrl
        const getAllNodesEndpoint = `${fortesUrl}/api/docker/nodes`

        const token = environment.dockerApiToken
        const headers = { headers: { 'Authorization': `Bearer ${token}` } }

        const allNodesGotFromFortes = (await axios.get(getAllNodesEndpoint, headers)).data
        return allNodesGotFromFortes
    } catch (error) {
        winston.error(`An error happened at the getAllNodes function: '${error}'`)
        throw error
    }
}