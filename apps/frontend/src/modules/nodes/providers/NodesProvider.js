import graphqlClient from "../../../apollo";

class NodesProvider {

    getDockerNodes(environment) {
        return graphqlClient.query({
            query: require('./gql/Nodes/getDockerNodes.graphql'),
            variables: {environment},
            fetchPolicy: "network-only"
        })
    }
}

export default new NodesProvider()


