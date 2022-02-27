import graphqlClient from "../../../apollo";

class StackProvider {

    findStack(id) {
        return graphqlClient.query({
            query: require('./gql/Stack/findStack.graphql'),
            variables: {id:id}
        })
    }

    fetchStack() {
        return graphqlClient.query({
            query: require('./gql/Stack/fetchStack.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateStack(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/Stack/paginateStack.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createStack(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Stack/createStack.graphql'),
            variables: {input}
        })
    }

    updateStack(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/Stack/updateStack.graphql'),
            variables: {id, input}
        })
    }

     deleteStack(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/Stack/deleteStack.graphql'),
            variables: {id}
        })
    }

}

export default new StackProvider()


