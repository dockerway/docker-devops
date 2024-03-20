import graphqlClient from "../../../apollo";

class NetworksProvider {

    getDockerNetworks(environment) {
        return graphqlClient.query({
            query: require('./gql/Networks/getDockerNetworks.graphql'),
            variables: {environment},
            fetchPolicy: "network-only"
        })
    }
}

export default new NetworksProvider()


