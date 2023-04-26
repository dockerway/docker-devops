import graphqlClient from "../../../apollo";

class DockerProvider {

    findDockerServiceTag(id) {
        return graphqlClient.query({
            query: require('./gql/Docker/findDockerServiceTag.graphql'),
            variables: {id:id},
            fetchPolicy: "network-only"
        })
    }

    findDockerServiceStats(id) {
        return graphqlClient.query({
            query: require('./gql/Docker/findDockerServiceStats.graphql'),
            variables: {id:id},
            fetchPolicy: "network-only"
        })
    }

    findDockerService(id) {
        return graphqlClient.query({
            query: require('./gql/Docker/findDockerService.graphql'),
            variables: {id:id},
            fetchPolicy: "network-only"
        })
    }

    createDockerService(id, targetImage) {
        return graphqlClient.mutate({
            mutation: require('./gql/Docker/createDockerService.graphql'),
            variables: {id, targetImage}
        })
    }

    updateDockerService(id, targetImage) {
        return graphqlClient.mutate({
            mutation: require('./gql/Docker/updateDockerService.graphql'),
            variables: {id, targetImage}
        })
    }
}

export default new DockerProvider()


