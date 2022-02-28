import {AuthenticationError} from "apollo-server-errors";
import {fetchImage, imageTags, imageTagsByFullname} from "../../services/ImageService";


export default {
    Query: {
        fetchImage: (_,{registry, rows},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return fetchImage(registry, rows)
        },
        imageTags: (_,{registry, name},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")

            return imageTags(registry, name)
        },
        imageTagsByFullname: (_,{fullname},{user}) => {
            if(!user)  throw new AuthenticationError("Usted no esta autenticado")
            return imageTagsByFullname(fullname)
        },
    }
}
