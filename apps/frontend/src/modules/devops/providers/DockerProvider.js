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

}

export default new DockerProvider()


