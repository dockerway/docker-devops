import apolloClient from '../../../apollo'

class ImageProvider {

    constructor() {
        this.gqlc = null
    }

    setGqlc(gqlc) {
        this.gqlc = gqlc
    }

    fetchImage(registry,rows) {
        return this.gqlc.query({
            query: require('./gql/Image/fetchImage.graphql'),
            variables: {registry,rows},
            fetchPolicy: "network-only"
        })
    }

    imageTags(registry,name) {
        return this.gqlc.query({
            query: require('./gql/Image/imageTags.graphql'),
            variables: {registry,name},
            fetchPolicy: "network-only"
        })
    }

    imageTagsByFullname(fullname) {
        return this.gqlc.query({
            query: require('./gql/Image/imageTagsByFullname.graphql'),
            variables: {fullname},
            fetchPolicy: "network-only"
        })
    }

}

const imageProvider = new ImageProvider()
imageProvider.setGqlc(apolloClient)
export default imageProvider
