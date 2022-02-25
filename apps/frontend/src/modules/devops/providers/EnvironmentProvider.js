import graphqlClient from "../../../apollo";

class EnvironmentProvider {

    findEnvironment(id) {
        return graphqlClient.query({
            query: require('./gql/Environment/findEnvironment.graphql'),
            variables: {id:id}
        })
    }

    fetchEnvironment() {
        return graphqlClient.query({
            query: require('./gql/Environment/fetchEnvironment.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateEnvironment(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/Environment/paginateEnvironment.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createEnvironment(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Environment/createEnvironment.graphql'),
            variables: {input}
        })
    }

    updateEnvironment(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Environment/updateEnvironment.graphql'),
            variables: {id, input}
        })
    }

     deleteEnvironment(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/Environment/deleteEnvironment.graphql'),
            variables: {id}
        })
    }

}

export default new EnvironmentProvider()


