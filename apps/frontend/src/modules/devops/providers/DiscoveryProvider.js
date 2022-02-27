import graphqlClient from "../../../apollo";

class DiscoveryProvider {

    startDiscovery(environmentId) {
        return graphqlClient.query({
            query: require('./gql/Discovery/startDiscovery.graphql'),
            variables: {environmentId:environmentId},
            fetchPolicy: "network-only"
        })
    }

    createDiscovery(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Discovery/createDiscovery.graphql'),
            variables: {input},
        })
    }

}

export default new DiscoveryProvider()


