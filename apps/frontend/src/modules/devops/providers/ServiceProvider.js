import graphqlClient from "../../../apollo";

class ServiceProvider {

    findService(id) {
        return graphqlClient.query({
            query: require('./gql/Service/findService.graphql'),
            variables: {id:id}
        })
    }

    fetchService() {
        return graphqlClient.query({
            query: require('./gql/Service/fetchService.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateService(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/Service/paginateService.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createService(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Service/createService.graphql'),
            variables: {input}
        })
    }

    updateService(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Service/updateService.graphql'),
            variables: {id, input}
        })
    }

     deleteService(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/Service/deleteService.graphql'),
            variables: {id}
        })
    }

}

export default new ServiceProvider()


