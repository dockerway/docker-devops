import graphqlClient from "../../../apollo";

class DockerProvider {

    findServiceTag(id) {
        return graphqlClient.query({
            query: require('./gql/Docker/findServiceTag.graphql'),
            variables: {id:id}
        })
    }


}

export default new DockerProvider()


