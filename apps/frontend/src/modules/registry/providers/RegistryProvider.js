import graphqlClient from "../../../apollo";

class RegistryProvider {

    findRegistry(id) {
        return graphqlClient.query({
            query: require('./gql/Registry/findRegistry.graphql'),
            variables: {id:id}
        })
    }

    fetchRegistry() {
        return graphqlClient.query({query: require('./gql/Registry/fetchRegistry.graphql')})
    }
    
    paginateRegistry(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/Registry/paginateRegistry.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }
    
    

    createRegistry(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Registry/createRegistry.graphql'),
            variables: {input}
        })
    }
    
    updateRegistry(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Registry/updateRegistry.graphql'),
            variables: {id, input}
        })
    }
    
     deleteRegistry(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/Registry/deleteRegistry.graphql'),
            variables: {id}
        })
    }

}

export default new RegistryProvider()


