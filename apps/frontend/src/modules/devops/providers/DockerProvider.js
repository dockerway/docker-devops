import graphqlClient from "../../../apollo";

class DockerProvider {

    findServiceTag(id) {
        return graphqlClient.query({
            query: require('./gql/Docker/findDockerServiceTag.graphql'),
            variables: {id:id}
        })
    }

    findDockerService(id) {
        return graphqlClient.query({
            query: require('./gql/Docker/findDockerService.graphql'),
            variables: {id:id}
        })
    }

    createDockerService({serviceId, name, image, replicas = 1, volumes = [], ports = [], envs = [], labels = []}) {
        return graphqlClient.mutate({
            mutation: require('./gql/Docker/createDockerService.graphql'),
            variables: {input: {serviceId, name, image, replicas, volumes, ports, envs, labels}}
        })
    }
}

export default new DockerProvider()


