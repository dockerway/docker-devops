import graphqlClient from "../../../apollo";

class EnvironmentServiceProvider {

    findEnvironmentService(id) {
        return graphqlClient.query({
            query: require('./gql/EnvironmentService/findEnvironmentService.graphql'),
            variables: {id:id}
        })
    }

    fetchEnvironmentService() {
        return graphqlClient.query({
            query: require('./gql/EnvironmentService/fetchEnvironmentService.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateEnvironmentService(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/EnvironmentService/paginateEnvironmentService.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createEnvironmentService(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/EnvironmentService/createEnvironmentService.graphql'),
            variables: {input}
        })
    }

    updateEnvironmentService(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/EnvironmentService/updateEnvironmentService.graphql'),
            variables: {id, input}
        })
    }

     deleteEnvironmentService(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/EnvironmentService/deleteEnvironmentService.graphql'),
            variables: {id}
        })
    }

}

export default new EnvironmentServiceProvider()


