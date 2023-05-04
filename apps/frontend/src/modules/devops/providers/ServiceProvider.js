import graphqlClient from "../../../apollo";

class ServiceTemplateProvider {

    findService(id) {
        return graphqlClient.query({
            query: require('./gql/ServiceTemplate/findServiceTemplate.graphql'),
            variables: {id:id}
        })
    }

    fetchService() {
        return graphqlClient.query({
            query: require('./gql/ServiceTemplate/fetchServiceTemplate.graphql'),
            fetchPolicy: "network-only"
        })
    }

    paginateService(pageNumber, itemsPerPage, search = null, filters = null,  orderBy = null, orderDesc = false) {
        return graphqlClient.query({
            query: require('./gql/ServiceTemplate/paginateServiceTemplate.graphql'),
            variables: {pageNumber, itemsPerPage, search, filters, orderBy, orderDesc},
            fetchPolicy: "network-only"
        })
    }



    createServiceTemplate(input) {
        return graphqlClient.mutate({
            mutation: require('./gql/ServiceTemplate/createServiceTemplate.graphql'),
            variables: {input}
        })
    }

    updateServiceTemplate(id,input) {
        return graphqlClient.mutate({
            mutation: require('./gql/ServiceTemplate/updateServiceTemplate.graphql'),
            variables: {id, input}
        })
    }

     deleteServiceTemplate(id) {
        return graphqlClient.mutate({
            mutation: require('./gql/ServiceTemplate/deleteServiceTemplate.graphql'),
            variables: {id}
        })
    }

}

export default new ServiceTemplateProvider()


