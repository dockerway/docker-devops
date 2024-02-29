
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';


//TYPES
const typesArray = fileLoader(path.join(__dirname, './types'));
export const types =  mergeTypes(typesArray, { all: true });


//RESOLVERS
const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
export const resolvers =  mergeResolvers(resolversArray);
