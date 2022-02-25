import graphqlClient from "../../../apollo";

class PlatformProvider {

    findPlatform(id) {
        return graphqlClient.query({
            query: require('./gql/Platform/findPlatform.graphql'),
            variables: {id:id}
        })
    }

    fetchPlatform() {
        return graphqlClient.query({
            query: require('./gql/Platform/fetchPlatform.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginatePlatform(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/Platform/paginatePlatform.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createPlatform(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Platform/createPlatform.graphql'),
            variables: {input}
        })
    }

    updatePlatform(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Platform/updatePlatform.graphql'),
            variables: {id, input}
        })
    }

     deletePlatform(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/Platform/deletePlatform.graphql'),
            variables: {id}
        })
    }

}

export default new PlatformProvider()


