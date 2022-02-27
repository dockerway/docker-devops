import graphqlClient from "../../../apollo";

class RestoreSystemProvider {
    restoreSystem(form) {
        return graphqlClient.mutate({
            mutation: require('./gql/restoreSystem.graphql'),
            variables: form
        })
    }

}

export default new RestoreSystemProvider()


